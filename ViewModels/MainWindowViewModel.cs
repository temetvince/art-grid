using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using ReactiveUI;

namespace art_grid.ViewModels;

public class MainWindowViewModel : ViewModelBase
{
    public MainWindowViewModel()
    {
        _startX = 0;
        _startY = 0;
    }

    public static string ImageTitle => "Open Image";
    public static string UpTitle => "Up";
    public static string DownTitle => "Down";
    public static string LeftTitle => "Left";
    public static string RightTitle => "Right";

    public Avalonia.Media.Imaging.Bitmap? GetImage
    {
        get => _croppedBitmap;
        private set => this.RaiseAndSetIfChanged(ref _croppedBitmap, value);
    }
    
    public void Up()
    {
        Crop(Direction.Up);
    }

    public void Down()
    {
        Crop(Direction.Down);
    }

    public void Left()
    {
        Crop(Direction.Left);
    }

    public void Right()
    {
        Crop(Direction.Right);
    }

    private Bitmap? _bitmap;
    private Avalonia.Media.Imaging.Bitmap? _croppedBitmap;
    private int _startX;
    private int _startY;
    private const int Cells = 20;

    private enum Direction
    {
        Up,
        Down,
        Left,
        Right,
        None
    }

    private void PickFile()
    {
        if (Application.Current?.ApplicationLifetime is not IClassicDesktopStyleApplicationLifetime desktop)
            return;

        var file = GetFile(desktop);

        if (file == null)
            return;

        _bitmap = new Bitmap(File.OpenRead(file));

        Crop(Direction.None);
    }

    private static string? GetFile(IClassicDesktopStyleApplicationLifetime desktop)
    {
        var dialog = new OpenFileDialog();

        return dialog.ShowAsync(desktop.MainWindow).Result?[0];
    }

    private void Crop(Direction direction)
    {
        if (_bitmap == null)
            return;

        var rawOriginal = _bitmap.LockBits(
            new Rectangle(0, 0, _bitmap.Width, _bitmap.Height),
            ImageLockMode.ReadOnly,
            PixelFormat.Format32bppArgb);

        var origByteCount = rawOriginal.Stride * rawOriginal.Height;
        var origBytes = new Byte[origByteCount];
        Marshal.Copy(rawOriginal.Scan0, origBytes, 0, origByteCount);

        var size = (_bitmap.Width < _bitmap.Height) ? _bitmap.Width / Cells : _bitmap.Height / Cells;
        _startX = GetX(direction, size);
        _startY = GetY(direction, size);
        var width = size;
        var height = size;
        const int bpp = 4; //4 Bpp = 32 bits, 3 = 24, etc.

        var croppedBytes = new Byte[width * height * bpp];

        //Iterate the selected area of the original image, and the full area of the new image
        for (var i = 0; i < height; i++)
        {
            for (var j = 0; j < width * bpp; j += bpp)
            {
                var origIndex = (_startX * rawOriginal.Stride) + (i * rawOriginal.Stride) + (_startY * bpp) + (j);
                var croppedIndex = (i * width * bpp) + (j);

                //copy data: once for each channel
                for (var k = 0; k < bpp; k++)
                {
                    croppedBytes[croppedIndex + k] = origBytes[origIndex + k];
                }
            }
        }

        //copy new data into a bitmap
        var croppedBitmap = new Bitmap(width, height);
        var croppedData = croppedBitmap.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly,
            PixelFormat.Format32bppArgb);
        Marshal.Copy(croppedBytes, 0, croppedData.Scan0, croppedBytes.Length);

        _bitmap.UnlockBits(rawOriginal);
        croppedBitmap.UnlockBits(croppedData);

        using var memory = new MemoryStream();
        croppedBitmap.Save(memory, ImageFormat.Png);
        memory.Position = 0;

        GetImage = new Avalonia.Media.Imaging.Bitmap(memory);
    }

    private int GetX(Direction direction, int size)
    {
        if (_bitmap == null)
            return 0;

        if (direction == Direction.None)
            return 0;

        return direction switch
        {
            Direction.Left or Direction.Right => _startX,
            Direction.Up => (_startX - size > 0) ? _startX - size : 0,
            Direction.Down => (_startX + 2 * size < _bitmap.Height) ? _startX + size : _startX,
            _ => 0
        };
    }

    private int GetY(Direction direction, int size)
    {
        if (_bitmap == null)
            return 0;

        if (direction == Direction.None)
            return 0;

        return direction switch
        {
            Direction.Up or Direction.Down => _startY,
            Direction.Left => (_startY - size > 0) ? _startY - size : 0,
            Direction.Right => (_startY + 2 * size < _bitmap.Width) ? _startY + size : _startY,
            _ => 0
        };
    }
}