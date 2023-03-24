using System.IO;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Media.Imaging;
using ReactiveUI;

namespace art_grid.ViewModels;

public class MainWindowViewModel : ViewModelBase
{
    public static string ImageTitle => "Open Image";

    public Bitmap? GetImage
    {
        get => _bitmap;
        private set => this.RaiseAndSetIfChanged(ref _bitmap, value);
    }
    
    private Bitmap? _bitmap;

    private void PickFile()
    {
        if (Application.Current?.ApplicationLifetime is not IClassicDesktopStyleApplicationLifetime desktop)
            return;

        OpenFileDialog dialog = new OpenFileDialog();
        var file = dialog.ShowAsync(desktop.MainWindow).Result?[0];

        if (file == null)
            return;

        GetImage = new Bitmap(File.OpenRead(file));
    }
}