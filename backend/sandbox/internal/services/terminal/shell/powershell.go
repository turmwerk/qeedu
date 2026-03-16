package shell

const (
	PowerShell      = "powershell"
	PowerShellImage = "mcr.microsoft.com/powershell:7.4-ubuntu-22.04"
)

var PowerShellCmd = []string{"pwsh", "-NoLogo"}
