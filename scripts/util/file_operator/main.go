package file_operator

import (
	"io"
	"os"
	"path/filepath"
)

type Service interface {
	GetPathList(path string) ([]string, error)
	HasPath(path string, name string) (bool, error)
	GetPathContents(path string) ([]byte, error)
	WritePathContents(path string, contents []byte) error
	CreateDirectory(path string) error
	CopyFile(src string, dest string) error
	RenameFile(oldPath string, newPath string) error
}

// fileOperator はServiceインターフェースの標準実装
type fileOperator struct {
}

// NewFileOperator は新しいfileOperatorのインスタンスを作成
func NewFileOperator() Service {
	return &fileOperator{}
}

func (f *fileOperator) GetPathList(path string) ([]string, error) {
	files, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	var fileList []string
	for _, file := range files {
		fileList = append(fileList, file.Name())
	}
	return fileList, nil
}

// 特定のフォルダーに特定の名前のファイルやディレクトリが存在するか確認
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

// GetPathContents はファイルの内容を読み込む
func (f *fileOperator) GetPathContents(path string) ([]byte, error) {
	return os.ReadFile(path)
}

// WritePathContents はファイルに内容を書き込む
func (f *fileOperator) WritePathContents(path string, contents []byte) error {
	// ディレクトリが存在しない場合は作成
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	return os.WriteFile(path, contents, 0644)
}

// CreateDirectory はディレクトリを作成する
func (f *fileOperator) CreateDirectory(path string) error {
	return os.MkdirAll(path, 0755)
}

// CopyFile はファイルをコピーする
func (f *fileOperator) CopyFile(src string, dest string) error {
	// コピー元ファイルを開く
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	// コピー先のディレクトリが存在しない場合は作成
	destDir := filepath.Dir(dest)
	if err := os.MkdirAll(destDir, 0755); err != nil {
		return err
	}

	// コピー先ファイルを作成
	destFile, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer destFile.Close()

	// ファイルをコピー
	_, err = io.Copy(destFile, sourceFile)
	if err != nil {
		return err
	}

	// ファイルの権限をコピー
	sourceInfo, err := os.Stat(src)
	if err != nil {
		return err
	}

	return os.Chmod(dest, sourceInfo.Mode())
}

// RenameFile はファイルの名前を変更する
func (f *fileOperator) RenameFile(oldPath string, newPath string) error {
	// 移動先のディレクトリが存在しない場合は作成
	newDir := filepath.Dir(newPath)
	if err := os.MkdirAll(newDir, 0755); err != nil {
		return err
	}

	return os.Rename(oldPath, newPath)
}
