import { ActionPanel, Action, Icon, List, Application, Color } from "@raycast/api";
import { getFoldersList } from "./getFoldersList";
import { getPreferenceValues } from "@raycast/api";
import { useFrecencySorting } from "@raycast/utils";

export default function Ws() {
  const { dirs, editor, terminal } = getPreferenceValues<{
    dirs: string;
    editor?: Application;
    terminal?: Application;
  }>();

  console.log({
    editor,
    terminal,
  });

  const projects = getFoldersList(
    dirs
      .split(",")
      .map((path) => path.trim())
      .filter(Boolean) as string[],
  );

  const { data, visitItem } = useFrecencySorting(projects, {
    key: (item) => item.fullPath,
  });

  return (
    <List>
      {data.map(({ name, fullPath, type }) => (
        <List.Item
          key={fullPath}
          icon={{
            source: type === "folder" ? Icon.Folder : Icon.Document,
            tintColor: type === "folder" ? Color.Orange : Color.Blue,
          }}
          title={name}
          subtitle={fullPath}
          actions={
            <ActionPanel>
              {editor && (
                <Action.Open
                  icon={Icon.Pencil}
                  title={`Open in ${editor.name}`}
                  onOpen={() => visitItem({ name, fullPath, type })}
                  target={fullPath}
                  application={editor}
                />
              )}
              {terminal && (
                <Action.Open
                  icon={Icon.Terminal}
                  title={`Open in ${terminal.name}`}
                  onOpen={() => visitItem({ name, fullPath, type })}
                  target={fullPath}
                  application={terminal}
                />
              )}
              <Action.CopyToClipboard content={fullPath} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
