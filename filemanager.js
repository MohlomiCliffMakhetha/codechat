document.addEventListener("DOMContentLoaded", function () {
    const fileManager = new DevExpress.ui.dxFileManager(document.getElementById("3-ccs"), {
        name: "fileManager",
        fileProvider: fileSystem,
        itemView: {
            mode: "thumbnails"
        },
        permissions: {
            create: true,
            copy: true,
            move: true,
            open: true,
            remove: true,
            rename: true,
            upload:true,
            download:true,
            refresh:false,
        },
        customizeThumbnail: function (fileManagerItem) {
            if (fileManagerItem.isDirectory)
                return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/folder.svg";
            const fileExtension = fileManagerItem.getExtension();
            switch (fileExtension) {
                case ".txt":
                    return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-txt.svg";
                case ".rtf":
                    return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-rtf.svg";
                case ".xml":
                    return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-xml.svg";
                case '.pdf':
                    return 'https://w7.pngwing.com/pngs/491/951/png-transparent-red-adobe-pdf-logo-pdf-computer-icons-adobe-acrobat-encapsulated-postscript-pdf-miscellaneous-angle-text.png'
                default:
                    return "";
            }
        }
    });
});

const fileSystem = [
    {
        name: "Personal",
        isDirectory: true,
        items: [
            {
                name: "Projects",
                isDirectory: true,
                items: [
                    {
                        name: "About.rtf",
                        isDirectory: false,
                        size: 1024
                    },
                    {
                        name: "Passwords.rtf",
                        isDirectory: false,
                        size: 2048
                    }
                ]
            },
            {
                name: "About.xml",
                isDirectory: false,
                size: 1024
            },
            {
                name: "Managers.rtf",
                isDirectory: false,
                size: 2048
            },
            {
                name: "ToDo.txt",
                isDirectory: false,
                size: 3072
            }
        ],
    },
    {
        name: "Educational",
        isDirectory: true,
        items: [
            {
                name: "logo.png",
                isDirectory: false,
                size: 20480
            },
            {
                name: "banner.gif",
                isDirectory: false,
                size: 10240
            }
        ]
    },
    {
        name: "Occupational",
        isDirectory: true,
        items: [
            {
                name: "Employees.txt",
                isDirectory: false,
                size: 3072
            },
            {
                name: "PasswordList.txt",
                isDirectory: false,
                size: 5120
            }
        ]
    }
];
