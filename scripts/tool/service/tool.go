package service

import (
	"util/file_operator"
)

type Service interface {
	GenerateService(name string, outputPath string) error
}

type toolService struct {
	fileOperator file_operator.Service
}

func NewToolService(fileOperator file_operator.Service) Service {
	return &toolService{
		fileOperator: fileOperator,
	}
}
