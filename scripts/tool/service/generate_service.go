package service

import (
	"fmt"
	"path/filepath"
	"strings"
)

var (
	templateServiceRootDir = "/templates/services"
)

func (t *toolService) GenerateService(serviceName string, outputPath string) error {
	fmt.Printf("🎯 Copying templates for service: %s...\n", serviceName)
	fmt.Printf("📁 Output base path: %s\n", outputPath)

	// 出力先ディレクトリのパスを設定
	outputDir := filepath.Join(outputPath, serviceName)

	exists, err := t.fileOperator.HasPath(outputPath, serviceName)
	if err != nil {
		return fmt.Errorf("❌ Error occurred while checking output directory: %v", err)
	}
	if !exists {
		if err := t.fileOperator.CreateDirectory(outputDir, nil); err != nil {
			return fmt.Errorf("❌ Error creating output directory: %v", err)
		}
		fmt.Printf("📂 Created output directory: %s\n", outputDir)
	}

	// テンプレートファイルの一覧を取得
	templateFilePaths, err := t.listTemplateFilePaths(templateServiceRootDir)
	if err != nil {
		return err
	}

	fmt.Println("\n📝 Copying files...")
	// 各テンプレートファイルをコピー
	for _, filePath := range templateFilePaths {
		if !strings.HasSuffix(filePath, ".tmpl") {
			continue
		}

		if err := t.generateServiceFile(filePath, serviceName, outputDir); err != nil {
			t.rollbackCreatedDirectory(outputDir)
			return fmt.Errorf("❌ Error generating service file (%s): %v", filePath, err)
		}

		fmt.Printf("	✅ Processed template file: %s\n", filePath)
	}

	fmt.Printf("🎉 Success! Service %s has been generated at %s\n", serviceName, outputDir)
	return nil
}

func (t *toolService) generateServiceFile(filePath string, serviceName string, outputPath string) error {
	tmpFileName, err := t.fileOperator.ChooseFileName(filePath)
	if err != nil {
		return fmt.Errorf("❌ Error getting template file name: %v", err)
	}
	outputFileName := strings.TrimSuffix(tmpFileName, ".tmpl")

	serviceNamePascal := t.stringOperator.ToPascalCase(serviceName)
	serviceNameCamel := t.stringOperator.ToCamelCase(serviceName)

	mapping := map[string]string{
		"{{.ServiceNamePascal}}": serviceNamePascal,
		"{{.ServiceNameCamel}}":  serviceNameCamel,
	}

	content, err := t.replaceMappingValues(filePath, mapping)
	if err != nil {
		return fmt.Errorf("❌ Error replacing mapping values: %v", err)
	}

	destPath := filepath.Join(outputPath, outputFileName)

	if err := t.fileOperator.WriteFileContents(destPath, []byte(content), nil); err != nil {
		return fmt.Errorf("❌ Error writing file (%s): %v", destPath, err)
	}

	fmt.Printf("  ✅ %s -> %s\n", outputFileName, destPath)
	return nil
}
