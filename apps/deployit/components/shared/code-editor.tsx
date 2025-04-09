import { cn } from "@/lib/utils";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { StreamLanguage } from "@codemirror/language";

import {
	type Completion,
	type CompletionContext,
	type CompletionResult,
	autocompletion,
} from "@codemirror/autocomplete";
import { properties } from "@codemirror/legacy-modes/mode/properties";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { EditorView } from "@codemirror/view";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror, { type ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { useTheme } from "next-themes";

const dockerComposeServices  =[
    { label: "services", type: "keyword", info: "Define services" },
	{ label: "version", type: "keyword", info: "Specify compose file version" },
	{ label: "volumes", type: "keyword", info: "Define volumes" },
	{ label: "networks", type: "keyword", info: "Define networks" },
	{ label: "configs", type: "keyword", info: "Define configuration files" },
	{ label: "secrets", type: "keyword", info: "Define secrets" },
].map((opt) =>({
    ...opt,
    apply:(view:EditorView, completion: Completion) => {
        const insert = `${completion.label}: `;
        view.dispatch({
            changes: {
                from: view.state.selection.main.from,
             to: view.state.selection.main.to,
             insert,
            },
            selection: {anchor: view.state.selection.main.from + insert.length},

        })
    }
}))


const dockerComposeServicesOption =[
    {
		label: "image",
		type: "keyword",
		info: "Specify the image to start the container from",
	},
	{ label: "build", type: "keyword", info: "Build configuration" },
	{ label: "command", type: "keyword", info: "Override the default command" },
	{ label: "container_name", type: "keyword", info: "Custom container name" },
	{
		label: "depends_on",
		type: "keyword",
		info: "Express dependency between services",
	},
	{ label: "environment", type: "keyword", info: "Add environment variables" },
	{
		label: "env_file",
		type: "keyword",
		info: "Add environment variables from a file",
	},
	{
		label: "expose",
		type: "keyword",
		info: "Expose ports without publishing them",
	},
	{ label: "ports", type: "keyword", info: "Expose ports" },
	{
		label: "volumes",
		type: "keyword",
		info: "Mount host paths or named volumes",
	},
	{ label: "restart", type: "keyword", info: "Restart policy" },
	{ label: "networks", type: "keyword", info: "Networks to join" },
].map((opt) => ({
	...opt,
	apply: (view: EditorView, completion: Completion) => {
		const insert = `${completion.label}: `;
		view.dispatch({
			changes: {
				from: view.state.selection.main.from,
				to: view.state.selection.main.to,
				insert,
			},
			selection: { anchor: view.state.selection.main.from + insert.length },
		});
	},
}));

