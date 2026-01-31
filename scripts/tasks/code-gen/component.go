package code_gen

import (
	"fmt"
	"path/filepath"
	"strings"
)

func (c *codeGenService) GenerateComponent(name string, outputPath string) error {
	var componentName string
	var fullOutputPath string

	repoRoot, err := c.fileOperator.GetRepositoryRootDir()
	if err != nil {
		return fmt.Errorf("❌ Error getting repository root dir: %v", err)
	}

	// フラグで引数が渡された場合
	if name != "" && outputPath != "" {
		componentName = c.stringOperator.ToPascalCase(name)

		if err := c.validateComponentName(name, outputPath); err != nil {
			return err
		}

		fullOutputPath = outputPath

		fmt.Printf("✨ PascalCase to: %s\n", componentName)
		fmt.Printf("📁 Output base path: %s\n", fullOutputPath)
	} else {
		// プロンプトモードで入力を取得
		selectedType, err := c.promptOperator.Select("Select component type", []string{"modules", "widgets"}, "widgets")
		if err != nil {
			return fmt.Errorf("❌ Error selecting component type: %v", err)
		}
		outputBasePath := filepath.Join(repoRoot, "src/components", selectedType)

		inputName, err := c.promptOperator.InputWithValidation(
			"Enter component name (to be converted to PascalCase)",
			func(input string) error {
				err := c.validateComponentName(input, outputBasePath)
				if err != nil {
					return err
				}
				return nil
			},
		)
		if err != nil {
			return fmt.Errorf("❌ Error getting component name: %v", err)
		}
		componentName = c.stringOperator.ToPascalCase(inputName)
		fmt.Printf("✨ PascalCase to: %s\n", componentName)

		fullOutputPath = filepath.Join(outputBasePath, componentName)
	}

	// コンポーネントディレクトリの作成
	if err := c.fileOperator.CreateDirectory(fullOutputPath, nil); err != nil {
		return fmt.Errorf("❌ Error creating component directory: %v", err)
	}

	// テンプレートファイルの処理
	templateFilePaths, err := c.listTemplateFilePaths("templates/components")
	if err != nil {
		return err
	}

	for _, filePath := range templateFilePaths {
		if !strings.HasSuffix(filePath, ".tmpl") {
			continue
		}

		if err := c.generateComponentFile(filePath, componentName, fullOutputPath); err != nil {
			c.rollbackCreatedDirectory(fullOutputPath)
			return fmt.Errorf("❌ Error generating component file (%s): %v", filePath, err)
		}

		fmt.Printf("  ✅ Processed template file: %s\n", filePath)
	}

	fmt.Printf("🎉 Success! Component %s has been generated at %s\n", componentName, fullOutputPath)
	return nil
}

func (c *codeGenService) validateComponentName(name string, path string) error {
	if strings.TrimSpace(name) == "" {
		return fmt.Errorf("component name is required")
	}

	if !isValidComponentName(name) {
		return fmt.Errorf("component name must consist of alphanumeric characters, hyphens, and underscores only: %s", name)
	}

	componentName := c.stringOperator.ToPascalCase(name)

	exists, _ := c.fileOperator.HasPath(path, componentName)
	if exists {
		return fmt.Errorf("component already exists: %s", componentName)
	}

	return nil
}

func isValidComponentName(name string) bool {
	for _, r := range name {
		if !(r >= 'a' && r <= 'z') && !(r >= 'A' && r <= 'Z') && !(r >= '0' && r <= '9') && r != '-' && r != '_' {
			return false
		}
	}
	return true
}

func (c *codeGenService) generateComponentFile(filePath string, componentName string, outputPath string) error {
	tmpFileName, err := c.fileOperator.ChooseFileName(filePath)
	if err != nil {
		return fmt.Errorf("error getting template file name: %v", err)
	}

	outputFileName := strings.TrimSuffix(tmpFileName, ".tmpl")
	outputFileName = strings.ReplaceAll(outputFileName, "Component", componentName)

	mapping := map[string]string{
		"{{.Component}}": componentName,
	}

	content, err := c.replaceMappingValues(filePath, mapping)
	if err != nil {
		return err
	}

	destPath := filepath.Join(outputPath, outputFileName)

	if err := c.fileOperator.WriteFileContents(destPath, []byte(content), nil); err != nil {
		return fmt.Errorf("❌ Error writing file (%s): %v", destPath, err)
	}

	fmt.Printf("  ✅ %s -> %s\n", outputFileName, destPath)
	return nil
}
