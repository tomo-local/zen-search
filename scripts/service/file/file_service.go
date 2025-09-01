package file_service

import (
	file_operator "util/file_operator"
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

type service struct {
	client file_operator.Service
}

func New(fileOperator file_operator.Service) (Service, error) {
	return &service{
		client: fileOperator,
	}, nil
}

func (s *service) GetPathList(path string) ([]string, error) {
	return s.client.GetPathList(path)
}

func (s *service) HasPath(path string, name string) (bool, error) {
	return s.client.HasPath(path, name)
}

func (s *service) GetPathContents(path string) ([]byte, error) {
	return s.client.GetPathContents(path)
}

func (s *service) WritePathContents(path string, contents []byte) error {
	return s.client.WritePathContents(path, contents)
}

func (s *service) CreateDirectory(path string) error {
	return s.client.CreateDirectory(path)
}

func (s *service) CopyFile(src string, dest string) error {
	return s.client.CopyFile(src, dest)
}

func (s *service) RenameFile(oldPath string, newPath string) error {
	return s.client.RenameFile(oldPath, newPath)
}
