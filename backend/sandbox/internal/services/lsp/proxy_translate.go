package lsp

import (
	"net/url"
	"path"
	"strconv"
	"strings"

	sandboxv1 "github.com/turmwerk/qeedu/backend/pkg/pb/sandbox/v1"
)

func translateDiagnostics(params publishDiagnosticsParams) (string, []diagnosticRecord) {
	filePath := normalizeDiagnosticPath(params.URI)
	translated := make([]diagnosticRecord, 0, len(params.Diagnostics))
	for _, item := range params.Diagnostics {
		translated = append(translated, diagnosticRecord{
			FilePath:    filePath,
			StartLine:   item.Range.Start.Line + 1,
			StartColumn: item.Range.Start.Character + 1,
			EndLine:     item.Range.End.Line + 1,
			EndColumn:   item.Range.End.Character + 1,
			Severity:    mapSeverity(item.Severity),
			Source:      item.Source,
			Message:     item.Message,
			Code:        stringifyCode(item.Code),
		})
	}
	return filePath, translated
}

func translateCompletions(items []lspCompletionItem) []completionRecord {
	translated := make([]completionRecord, 0, len(items))
	for _, item := range items {
		insertText := item.InsertText
		if insertText == "" {
			insertText = item.Label
		}
		translated = append(translated, completionRecord{
			Label:         item.Label,
			InsertText:    insertText,
			Detail:        item.Detail,
			Documentation: stringifyDocumentation(item.Documentation),
			Kind:          strconv.FormatInt(int64(item.Kind), 10),
		})
	}
	return translated
}

func normalizeDiagnosticPath(uri string) string {
	parsed, err := url.Parse(uri)
	if err != nil {
		return uri
	}
	value := parsed.Path
	value = strings.TrimPrefix(value, workspaceDir)
	if value == "" {
		return "/"
	}
	return normalizePath(value)
}

func mapSeverity(value int32) sandboxv1.DiagnosticSeverity {
	switch value {
	case 1:
		return sandboxv1.DiagnosticSeverity_DIAGNOSTIC_SEVERITY_ERROR
	case 2:
		return sandboxv1.DiagnosticSeverity_DIAGNOSTIC_SEVERITY_WARNING
	case 3:
		return sandboxv1.DiagnosticSeverity_DIAGNOSTIC_SEVERITY_INFORMATION
	case 4:
		return sandboxv1.DiagnosticSeverity_DIAGNOSTIC_SEVERITY_HINT
	default:
		return sandboxv1.DiagnosticSeverity_DIAGNOSTIC_SEVERITY_UNSPECIFIED
	}
}

func stringifyCode(code any) string {
	switch value := code.(type) {
	case string:
		return value
	case float64:
		return strconv.FormatInt(int64(value), 10)
	default:
		return ""
	}
}

func stringifyDocumentation(value any) string {
	switch doc := value.(type) {
	case string:
		return doc
	case map[string]any:
		if text, ok := doc["value"].(string); ok {
			return text
		}
	}
	return ""
}

func fileURI(filePath string) string {
	return "file://" + filePath
}

func workspaceFileURI(filePath string) string {
	return fileURI(path.Join(workspaceDir, strings.TrimPrefix(filePath, "/")))
}

func maxInt32(value int32, floor int32) int32 {
	if value < floor {
		return floor
	}
	return value
}
