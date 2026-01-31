package cmd

import (
	"log"
	fileutil "scripts/pkg/file-operator"
	"scripts/pkg/prompt"
	strutil "scripts/pkg/str-operator"
	codegen "scripts/tasks/code-gen"

	"github.com/spf13/cobra"
)

func NewCodeGenCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "gen",
		Short: "コード生成コマンド 🚀",
		Long:  `サービスやコンポーネントのテンプレートを生成します。`,
	}

	// サブコマンドを追加
	cmd.AddCommand(newServiceCommand())
	cmd.AddCommand(newComponentCommand())

	return cmd
}

func newServiceCommand() *cobra.Command {
	var serviceName string
	var outputPath string

	cmd := &cobra.Command{
		Use:   "service",
		Short: "サービスファイルを生成します ✨",
		Long: `指定されたサービス名でテンプレートファイルを生成します。

	テンプレートファイル（.tmpl）は TypeScript ファイル（.ts）として
	指定された出力先ディレクトリに生成されます。`,
		Run: func(cmd *cobra.Command, args []string) {
			log.Println("Generating service:", serviceName)

			codeGenService := createCodeGenService()
			err := codeGenService.GenerateService(serviceName, outputPath)
			if err != nil {
				log.Println(err)
			}
		},
	}

	cmd.Flags().StringVarP(&serviceName, "name", "n", "", "サービス名を指定してください（必須）")
	cmd.Flags().StringVarP(&outputPath, "path", "p", "src/services", "出力先のベースパスを指定してください")
	cmd.MarkFlagRequired("name")

	return cmd
}

func newComponentCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "component",
		Short: "コンポーネントファイルを生成します ✨",
		Long: `対話形式でコンポーネント名と出力先パスを取得し、テンプレートファイルを生成します。

	テンプレートファイル（.tmpl）は TypeScript ファイル（.ts）として
	指定された出力先ディレクトリに生成されます。`,
		Run: func(cmd *cobra.Command, args []string) {
			codeGenService := createCodeGenService()
			err := codeGenService.GenerateComponent(cmd.Flag("name").Value.String(), cmd.Flag("path").Value.String())
			if err != nil {
				log.Println(err)
			}
		},
	}

	cmd.Flags().StringP("name", "n", "", "コンポーネント名を指定してください（省略可）")
	cmd.Flags().StringP("path", "p", "", "出力先のベースパスを指定してください（省略可）")

	return cmd
}

func createCodeGenService() codegen.Service {
	fileOperator := fileutil.NewFileOperator()
	stringOperator := strutil.NewStringOperator()
	promptOperator := prompt.NewPromptOperator()
	return codegen.NewCodeGenService(fileOperator, stringOperator, promptOperator)
}
