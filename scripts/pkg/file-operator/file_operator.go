package fileutil

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Service interface {
	CreateDirectory(path string, perm *os.FileMode) error
	DeleteDirectory(path string) error
	GetRepositoryRootDir() (string, error)
	GetPathContents(path string) ([]byte, error)
	ListFilePaths(path string) ([]string, error)
	ListFileNames(path string) ([]string, error)
	HasPath(path string, name string) (bool, error)
	WriteFileContents(path string, contents []byte, perm *os.FileMode) error

	ChooseFileName(pathFileName string) (string, error)
}

// fileOperator はServiceインターフェースの標準実装
type fileOperator struct {
}

// NewFileOperator は新しいfileOperatorのインスタンスを作成
func NewFileOperator() Service {
	return &fileOperator{}
}

func (f *fileOperator) CreateDirectory(path string, perm *os.FileMode) error {
	if perm == nil {
		defaultPerm := os.FileMode(0755)
		perm = &defaultPerm
	}
	return os.MkdirAll(path, *perm)
}

func (f *fileOperator) DeleteDirectory(path string) error {
	return os.RemoveAll(path)
}

func (f *fileOperator) GetRepositoryRootDir() (string, error) {
	currentDir, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("現在の作業ディレクトリの取得に失敗しました: %v", err)
	}

	// .git ディレクトリを探してリポジトリのルートを特定
	for {
		if _, err := os.Stat(filepath.Join(currentDir, ".git")); err == nil {
			return currentDir, nil
		}

		parentDir := filepath.Dir(currentDir)
		if parentDir == currentDir {
			break // ルートディレクトリに到達
		}
		currentDir = parentDir
	}

	return "", fmt.Errorf(".git ディレクトリが見つかりません。リポジトリのルートを特定できませんでした。")
}

func (f *fileOperator) GetPathContents(path string) ([]byte, error) {
	return os.ReadFile(path)
}

func (f *fileOperator) WriteFileContents(path string, contents []byte, perm *os.FileMode) error {
	if perm == nil {
		defaultPerm := os.FileMode(0644)
		perm = &defaultPerm
	}
	return os.WriteFile(path, contents, *perm)
}

func (f *fileOperator) ListFilePaths(path string) ([]string, error) {
	files, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	var fileList []string
	for _, file := range files {
		if !file.IsDir() {
			fileList = append(fileList, filepath.Join(path, file.Name()))
		}
	}
	return fileList, nil
}

func (f *fileOperator) ListFileNames(path string) ([]string, error) {
	files, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	var fileNames []string
	for _, file := range files {
		if !file.IsDir() {
			fileNames = append(fileNames, file.Name())
		}
	}
	return fileNames, nil
}

func (f *fileOperator) HasPath(path string, name string) (bool, error) {
	fullPath := filepath.Join(path, name)
	_, err := os.Stat(fullPath)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (f *fileOperator) ChooseFileName(pathFileName string) (string, error) {
	if pathFileName == "" {
		return "", fmt.Errorf("file path is empty")
	}

	root := strings.Split(pathFileName, "/")

	if len(root) == 0 {
		return "", fmt.Errorf("invalid file path: %s", pathFileName)
	}

	fileName := root[len(root)-1]
	if fileName == "" {
		return "", fmt.Errorf("file name is empty in path: %s", pathFileName)
	}

	return fileName, nil
}
