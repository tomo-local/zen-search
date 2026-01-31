package main

import (
	"log"
	"os"
	"scripts/cmd"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "scripts",
	Short: "Zen Search スクリプトツール 🚀",
	Long:  `Zen Search プロジェクトのための開発ツール集です。`,
}

func init() {
	// コマンドを追加
	rootCmd.AddCommand(cmd.NewCodeGenCommand())
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		log.Println(err)
		os.Exit(1)
	}
}
