package file_operator

import (
	"strings"
)

// toCamelCase は文字列をキャメルケースに変換
func ToCamelCase(s string) string {
	words := strings.Split(s, "-")
	if len(words) == 0 {
		return s
	}

	result := words[0]
	for i := 1; i < len(words); i++ {
		if len(words[i]) > 0 {
			result += strings.ToUpper(string(words[i][0])) + words[i][1:]
		}
	}
	return result
}

// toPascalCase は文字列をパスカルケースに変換
func ToPascalCase(s string) string {
	words := strings.Split(s, "-")
	result := ""
	for _, word := range words {
		if len(word) > 0 {
			result += strings.ToUpper(string(word[0])) + word[1:]
		}
	}
	return result
}
