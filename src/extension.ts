import * as vscode from 'vscode';
import * as search from './search';
import * as directories from './directories';

let fs = require('fs');

function openDocErrorMessage(str) {
	return vscode.window.showErrorMessage("Error: " + str, "Open Docs").then((item) => {
		if (item === "Open Docs") {
			search.openURL();
		}
	});
}

export function activate(context: vscode.ExtensionContext) {

	//Tell the user the extension has been activated.
	console.log('Unity Tools extension is now active!');

	// Open Unity Documentation, when you already have something you want to search selected
	var open_docs = vscode.commands.registerTextEditorCommand("unity.OpenDocs",
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {

			// selection[0] is the start, and selection[1] is the end
			let selection = textEditor.selection;
			if (!selection.isSingleLine) {
				openDocErrorMessage("Multiple lines selected, please just select a class.");
				return;
			}

			let range = undefined;
			if (!selection.isEmpty) {
				// selection is not empty, get text from it
				range = new vscode.Range(selection.start, selection.end);
			} else {
				// selection is empty, get any word at cursor
				range = textEditor.document.getWordRangeAtPosition(selection.active);
			}

			if (range == undefined) {
				openDocErrorMessage("Nothing is selected. Please select a class!");
				return;
			}

			search.openUnityDocs(textEditor.document.lineAt(range.start.line).text, range.start.character, range.end.character);
		});
	context.subscriptions.push(open_docs);

	var search_docs = vscode.commands.registerCommand("unity.SearchDocs", () => {
		vscode.window.showInputBox({
			prompt: "Search the Unity Documentation:"
		}).then((result) => {
			if (result != undefined) {
				//Use the node module "open" to open a web browser
				search.openURL(result);
			}
		});
	});
	context.subscriptions.push(search_docs);

	var open_vscode_docs = vscode.commands.registerCommand("unity.OpenVSCodeDocs", () => {
		// Using OpenURL from search to open VS Documentation.
        // Passing "true" to open the URL directly (instead of searching Unity docs)
        search.openURL("https://code.visualstudio.com/Docs/runtimes/unity", true);

	});
	context.subscriptions.push(open_vscode_docs);

	var get_assetstore_plugin = vscode.commands.registerCommand("unity.GetAssetStorePlugin", () => {
		search.openURL("http://u3d.as/jmM", true);
        return vscode.window.showErrorMessage("Add to your Unity project, and remember check \"Enable Integration\"", "How To", "Git").then((item) => {
			if (item === "How To") {
				// Using OpenURL from search to open Unity plug-in Documentation in git repo.
				// Passing "true" to open the URL directly (instead of searching Unity docs)
				search.openURL("https://github.com/dotBunny/VSCode/blob/master/HOWTO.pdf", true);
			} else if (item === "Git") {
				// Using OpenURL from search to open Unity plug-in git repo.
				// Passing "true" to open the URL directly (instead of searching Unity docs)
				search.openURL("https://github.com/dotBunny/VSCode/", true);
			}
		});
	});
	context.subscriptions.push(get_assetstore_plugin);


    var create_Directories = vscode.commands.registerCommand("unity.CreateDirectories", () => {
		var rootPath = vscode.workspace.rootPath;
		if (rootPath != undefined) {
			fs.stat(rootPath, (err, stats) => {
				if (err && err.code === 'ENOENT') {
					vscode.window.showErrorMessage("You do not have access or permission to this file on the hard drive.");
				} else if (stats.isDirectory()) {
					var rootPath = vscode.workspace.rootPath + '/Assets/';
					//path exists
					fs.stat(rootPath, (err, stats) => {
						if (err && err.code === 'ENOENT') {
							// The folder does not exist
							vscode.window.showErrorMessage("Could not find an Assets Folder in the current workspace of VSCode. Please open the Unity root folder of the project you are working on.");
						} else if (err) {
							vscode.window.showErrorMessage("Something went wrong while checking Assets folder existence: " + err)
						} else if (stats.isDirectory()) {
							// Folder exists! Generate default folders. 

							var settings: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('unity');

							var folderList = settings.get('defaultOrganizationFolders', [
								"Materials",
								"Scenes",
								"Scripts",
								"Prefabs",
								"Audio"
							]);

							directories.GenerateOrganizationFolders(rootPath, folderList);
							vscode.window.showInformationMessage("Folders generated sucessfully");
						}
					});
				}
			});
		} else {
			vscode.window.showErrorMessage("You do not have a workspace open in VSCode. Please 'Open Folder' to the root folder of a desired Unity Project.");
		}

	});
    context.subscriptions.push(create_Directories);


}