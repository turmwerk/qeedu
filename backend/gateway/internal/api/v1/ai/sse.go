package ai

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func writeSSEPayload(w io.Writer, payload any) {
	data, err := json.Marshal(payload)
	if err != nil {
		fmt.Fprintf(w, "data: [ERROR] %s\n\n", err.Error())
		flush(w)
		return
	}
	fmt.Fprintf(w, "data: %s\n\n", data)
	flush(w)
}

func writeSSEDone(w io.Writer) {
	fmt.Fprint(w, "data: [DONE]\n\n")
	flush(w)
}

func writeSSEError(w io.Writer, err error) {
	writeSSEPayload(w, map[string]string{"error": err.Error()})
}

func flush(w io.Writer) {
	if f, ok := w.(http.Flusher); ok {
		f.Flush()
	}
}
