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
    public static string ImageTitle => "Open Image";

    public Avalonia.Media.Imaging.Bitmap? GetImage
    {
        get => _croppedBitmap;
        private set => this.RaiseAndSetIfChanged(ref _croppedBitmap, value);
    }

    private Bitmap? _bitmap;
    private Avalonia.Media.Imaging.Bitmap? _croppedBitmap;

    private void PickFile()
    {
        if (Application.Current?.ApplicationLifetime is not IClassicDesktopStyleApplicationLifetime desktop)
            return;

        var file = GetFile(desktop);

        if (file == null)
            return;

        _bitmap = new Bitmap(File.OpenRead(file));

        Crop();
    }

    private string? GetFile(IClassicDesktopStyleApplicationLifetime desktop)
    {
        var dialog = new OpenFileDialog();

        return dialog.ShowAsync(desktop.MainWindow).Result?[0];
    }

    private void Crop()
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

        //I want to crop a 100x100 section starting at 15, 15.
        const int startX = 15;
        const int startY = 15;
        const int width = 100;
        const int height = 100;
        const int bpp = 4; //4 Bpp = 32 bits, 3 = 24, etc.

        var croppedBytes = new Byte[width * height * bpp];

        //Iterate the selected area of the original image, and the full area of the new image
        for (var i = 0; i < height; i++)
        {
            for (var j = 0; j < width * bpp; j += bpp)
            {
                var origIndex = (startX * rawOriginal.Stride) + (i * rawOriginal.Stride) + (startY * bpp) + (j);
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
}