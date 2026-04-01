import { readdirSync } from "fs";
import { basename, join } from "path";

const workspaceExtension = ".code-workspace";

const getWorkspacesFromFolder = (dir: string): ReturnType<typeof getFoldersList> => {
  return readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith(workspaceExtension))
    .map(({ name }) => ({
      type: "workspace",
      name: basename(name, workspaceExtension),
      fullPath: join(dir, name),
    }));
};

export const getFoldersList = (
  directories: string[],
): {
  type: "folder" | "workspace";
  name: string;
  fullPath: string;
}[] => {
  return directories.reduce<ReturnType<typeof getFoldersList>>((acc, dir) => {
    readdirSync(dir, {
      withFileTypes: true,
    }).forEach((dirent) => {
      if (!dirent.isDirectory()) return;

      const fullPath = join(dir, dirent.name);

      acc.push({
        type: "folder",
        name: dirent.name,
        fullPath,
      });

      acc.push(...getWorkspacesFromFolder(fullPath));
    });

    return acc;
  }, []);
};
