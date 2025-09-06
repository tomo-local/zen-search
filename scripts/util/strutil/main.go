package strutil

import (
	"strings"
)

type Service interface {
	ToCamelCase(s string) string
	ToPascalCase(s string) string
	ReplaceAllMapping(original string, mapping map[string]string) string
}

type stringOperator struct{}

// NewStringOperator は新しいstringOperatorのインスタンスを作成
func NewStringOperator() Service {
	return &stringOperator{}
}

// ToCamelCase は文字列をキャメルケースに変換
func (s *stringOperator) ToCamelCase(str string) string {
	words := strings.Split(str, "-")
	if len(words) == 0 && words[0] == "" {
		return str
	}

	result := words[0]
	for i := 1; i < len(words); i++ {
		if len(words[i]) > 0 {
			result += strings.ToUpper(string(words[i][0])) + words[i][1:]
		}
	}
	return result
}

// ToPascalCase は文字列をパスカルケースに変換
func (s *stringOperator) ToPascalCase(str string) string {
	words := strings.Split(str, "-")
	result := ""
	for _, word := range words {
		if len(word) > 0 {
			result += strings.ToUpper(string(word[0])) + word[1:]
		}
	}
	return result
}

func (s *stringOperator) ReplaceAllMapping(original string, mapping map[string]string) string {
	for old, new := range mapping {
		original = strings.ReplaceAll(original, old, new)
	}
	return original
}
