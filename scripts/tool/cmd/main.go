package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

// rootCmd はベースコマンドを表します
var rootCmd = &cobra.Command{
	Use:   "tool",
	Short: "テンプレート生成ツール 🚀",
	Long:  ``,
	Example: `  tool generate:service -n my-service
  tool generate:service -n auth -p src/api/services
  tool generate:service --name payment --path custom/services`,
}

func init() {
	toolService := setupToolService()

	rootCmd.AddCommand(setupGenerateService(toolService))
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
