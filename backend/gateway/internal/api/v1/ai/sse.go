package ai

import (
	"encoding/json"
	"fmt"
	"io"
)

func writeSSEPayload(w io.Writer, payload any) {
	data, err := json.Marshal(payload)
	if err != nil {
		fmt.Fprintf(w, "data: [ERROR] %s\n\n", err.Error())
		return
	}
	fmt.Fprintf(w, "data: %s\n\n", data)
}

func writeSSEDone(w io.Writer) {
	fmt.Fprint(w, "data: [DONE]\n\n")
}

func writeSSEError(w io.Writer, err error) {
	writeSSEPayload(w, map[string]string{"error": err.Error()})
}
