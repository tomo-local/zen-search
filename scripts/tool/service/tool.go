package service

import (
	"util/fileutil"
	"util/strutil"
)

type Service interface {
	GenerateService(name string, outputPath string) error
}

type toolService struct {
	fileOperator   fileutil.Service
	stringOperator strutil.Service
}

func NewToolService(fileOperator fileutil.Service, stringOperator strutil.Service) Service {
	return &toolService{
		fileOperator:   fileOperator,
		stringOperator: stringOperator,
	}
}
