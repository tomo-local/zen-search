package service

import (
	"fmt"
	"log"
	"path/filepath"
	"strings"
)

var (
	templateServiceRootDir = "/templates/services"
)

func (t *toolService) GenerateService(serviceName string, outputPath string) error {
	fmt.Printf("🎯 サービス名: %s でテンプレートをコピーします...\n", serviceName)
	fmt.Printf("📁 出力先ベースパス: %s\n", outputPath)

	// 出力先ディレクトリのパスを設定
	outputDir := filepath.Join(outputPath, serviceName)

	exists, err := t.fileOperator.HasPath(outputPath, serviceName)
	if err != nil {
		return fmt.Errorf("❌ 出力先ディレクトリの確認でエラーが発生しました: %v", err)
	}
	if !exists {
		if err := t.fileOperator.CreateDirectory(outputDir, nil); err != nil {
			return fmt.Errorf("❌ 出力先ディレクトリの作成に失敗しました: %v", err)
		}
		fmt.Printf("📂 出力先ディレクトリを作成しました: %s\n", outputDir)
	}

	// テンプレートファイルの一覧を取得
	templateFiles, err := t.getTemplateFiles(templateServiceRootDir)
	if err != nil {
		return err
	}

	fmt.Println("\n📝 ファイルをコピー中...")
	// 各テンプレートファイルをコピー
	for _, templateFile := range templateFiles {
		if !strings.HasSuffix(templateFile, ".tmpl") {
			continue
		}

		// テンプレートファイルのパス
		srcPath := filepath.Join(templatesDir, templateFile)
		outputFileName := strings.TrimSuffix(templateFile, ".tmpl")
		destPath := filepath.Join(outputDir, outputFileName)

		// テンプレート内容を変換
		content, err := t.convertToTemplateContent(srcPath, serviceName)
		if err != nil {
			log.Printf("❌ テンプレート内容の変換に失敗しました (%s): %v", srcPath, err)
			continue
		}

		if err := t.fileOperator.WriteFileContents(destPath, content, nil); err != nil {
			return fmt.Errorf("❌ 出力ファイルの書き込みに失敗しました (%s): %v", destPath, err)
		}

		fmt.Printf("  ✅ %s -> %s\n", srcPath, destPath)
	}

	fmt.Printf("\n🎉 サービス '%s' のテンプレートファイルのコピーが完了しました！\n", serviceName)
	fmt.Printf("📍 出力先: %s\n", outputDir)

	return nil
}

func (t *toolService) convertToTemplateContent(path string, serviceName string) ([]byte, error) {
	content, err := t.fileOperator.GetPathContents(path)

	if err != nil {
		return nil, fmt.Errorf("❌ テンプレートファイルの読み込みに失敗しました (%s): %v", path, err)
	}

	ServiceNamePascal := t.stringOperator.ToPascalCase(serviceName)
	ServiceNameCamel := t.stringOperator.ToCamelCase(serviceName)

	content = []byte(strings.ReplaceAll(string(content), "{{.ServiceNamePascal}}", ServiceNamePascal))
	content = []byte(strings.ReplaceAll(string(content), "{{.ServiceNameCamel}}", ServiceNameCamel))

	return content, nil
}
