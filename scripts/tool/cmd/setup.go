package main

import (
	"tool/service"
	"util/file_operator"

	"github.com/spf13/cobra"
)

func setupToolService() service.Service {
	fileOperator := file_operator.NewFileOperator()
	return service.NewToolService(fileOperator)
}

func setupGenerateService(toolService service.Service) *cobra.Command {
	var serviceName string
	var outputPath string

	cmd := &cobra.Command{
		Use:   "generate:service",
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
	cmd.RunE = func(cmd *cobra.Command, args []string) error {
		return toolService.GenerateService(serviceName, outputPath)
	}

	return cmd
}
