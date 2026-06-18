import { readdirSync } from "fs";
import { basename, join } from "path";

const workspaceExtension = ".code-workspace";

export type FolderListItem = {
  type: "folder" | "workspace";
  name: string;
  fullPath: string;
  folderPath: string;
};

const getWorkspacesFromFolder = (dir: string): FolderListItem[] => {
  return readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith(workspaceExtension))
    .map(({ name }) => ({
      type: "workspace" as const,
      name: basename(name, workspaceExtension),
      fullPath: join(dir, name),
      folderPath: dir,
    }));
};

export const getFoldersList = (directories: string[]): FolderListItem[] => {
  return directories.reduce<FolderListItem[]>((acc, dir) => {
    readdirSync(dir, {
      withFileTypes: true,
    }).forEach((dirent) => {
      if (!dirent.isDirectory()) return;

      const fullPath = join(dir, dirent.name);
      const workspaces = getWorkspacesFromFolder(fullPath);

      if (workspaces.length > 0) {
        acc.push(...workspaces);
      } else {
        acc.push({
          type: "folder",
          name: dirent.name,
          fullPath,
          folderPath: fullPath,
        });
      }
    });

    return acc;
  }, []);
};
