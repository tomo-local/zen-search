package main

import (
	"log"
	"os"

	"github.com/spf13/cobra"
)

// rootCmd はベースコマンドを表します
var rootCmd = &cobra.Command{
	Use:   "root",
	Short: "テンプレート生成ツール 🚀",
	Long: `
	指定されたサービス名でテンプレートファイルを生成します。
	`,
	Example: `  tool service -n my-service
  tool service -n auth -p src/api/services
  tool service --name payment --path custom/services`,
}

func init() {
	toolService := setupToolService()
	serviceCmd := setupGenerateService(toolService)
	rootCmd.AddCommand(serviceCmd)

	componentCmd := setupGenerateComponent(toolService)
	rootCmd.AddCommand(componentCmd)
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		log.Println(err)
		os.Exit(1)
	}
}
