package service

import (
	"util/fileutil"
	"util/strutil"
	"tool/prompt"
)

type Service interface {
	GenerateService(name string, outputPath string) error
	GenerateComponent(name string, outputPath string) error
}

type toolService struct {
	fileOperator   fileutil.Service
	stringOperator strutil.Service
	promptOperator prompt.Service
}

func NewToolService(fileOperator fileutil.Service, stringOperator strutil.Service, promptOperator prompt.Service) Service {
	return &toolService{
		fileOperator:   fileOperator,
		stringOperator: stringOperator,
		promptOperator: promptOperator,
	}
}
