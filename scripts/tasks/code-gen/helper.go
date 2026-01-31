package code_gen

import (
	"fmt"
	"path/filepath"
)

func (c *codeGenService) listTemplateFilePaths(targetSubDir string) ([]string, error) {
	repoRoot, err := c.fileOperator.GetRepositoryRootDir()
	if err != nil {
		return nil, fmt.Errorf("error getting repository root dir: %v", err)
	}

	templatesDir := filepath.Join(repoRoot, targetSubDir)

	templateFilePaths, err := c.fileOperator.ListFilePaths(templatesDir)
	if err != nil {
		return nil, fmt.Errorf("error getting template file paths: %v", err)
	}

	if len(templateFilePaths) == 0 {
		return nil, fmt.Errorf("error: no template files found in %s", templatesDir)
	}

	return templateFilePaths, nil
}

func (c *codeGenService) replaceMappingValues(path string, mapping map[string]string) (string, error) {
	content, err := c.fileOperator.GetPathContents(path)

	if err != nil {
		return "", fmt.Errorf("error reading template file (%s): %v", path, err)
	}

	convertedContent := c.stringOperator.ReplaceAllMapping(string(content), mapping)

	return convertedContent, nil
}

func (c *codeGenService) rollbackCreatedDirectory(directory string) error {
	if err := c.fileOperator.DeleteDirectory(directory); err != nil {
		return fmt.Errorf("error deleting created directory: %v", err)
	}

	fmt.Printf("🗑 Deleted created directory: %s\n", directory)
	return nil
}
