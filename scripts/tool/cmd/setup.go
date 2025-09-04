package main

import (
	"log"
	"tool/service"
	"util/fileutil"
	"util/strutil"

	"github.com/spf13/cobra"
)

func setupToolService() service.Service {
	fileOperator := fileutil.NewFileOperator()
	stringOperator := strutil.NewStringOperator()
	return service.NewToolService(fileOperator, stringOperator)
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
