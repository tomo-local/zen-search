package main

import (
	"log"
	"tool/prompt"
	"tool/service"
	"util/fileutil"
	"util/strutil"

	"github.com/spf13/cobra"
)

func setupToolService() service.Service {
	fileOperator := fileutil.NewFileOperator()
	stringOperator := strutil.NewStringOperator()
	promptOperator := prompt.NewPromptOperator()
	return service.NewToolService(fileOperator, stringOperator, promptOperator)
}

func setupGenerateService(toolService service.Service) *cobra.Command {
	var serviceName string
	var outputPath string

	cmd := &cobra.Command{
		Use:   "gen:service",
		Short: "サービスファイルを生成します ✨",
		Long: `指定されたサービス名でテンプレートファイルを生成します。

	テンプレートファイル（.tmpl）は TypeScript ファイル（.ts）として
	指定された出力先ディレクトリに生成されます。`,
	}

	// generateコマンドにフラグを追加
	cmd.Flags().StringVarP(&serviceName, "name", "n", "", "サービス名を指定してください（必須）")
	cmd.Flags().StringVarP(&outputPath, "path", "p", "src/services", "出力先のベースパスを指定してください")

	// nameフラグを必須に設定
	cmd.MarkFlagRequired("name")

	// generateコマンドの実行時に呼び出される関数を設定
	cmd.Run = func(cmd *cobra.Command, args []string) {
		log.Println("Generating service:", args)

		err := toolService.GenerateService(serviceName, outputPath)
		if err != nil {
			log.Println(err)
		}
	}

	return cmd
}

func setupGenerateComponent(toolService service.Service) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "gen:component",
		Short: "コンポーネントファイルを生成します ✨",
		Long: `対話形式でコンポーネント名と出力先パスを取得し、テンプレートファイルを生成します。

	テンプレートファイル（.tmpl）は TypeScript ファイル（.ts）として
	指定された出力先ディレクトリに生成されます。`,
	}

	cmd.Flags().StringP("name", "n", "", "コンポーネント名を指定してください（省略可）")
	cmd.Flags().StringP("path", "p", "", "出力先のベースパスを指定してください（省略可）")

	// generateコマンドの実行時に呼び出される関数を設定
	cmd.Run = func(cmd *cobra.Command, args []string) {
		err := toolService.GenerateComponent(cmd.Flag("name").Value.String(), cmd.Flag("path").Value.String())
		if err != nil {
			log.Println(err)
		}
	}

	return cmd
}
