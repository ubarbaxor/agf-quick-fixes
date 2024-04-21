import { useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { EllipsisHorizontalIcon, UserPlusIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { queries } from "@/lib/queries";
import { toast } from "sonner";
import { PersonaBundle, PersonaFormData } from "@shared/types";
import { useApp } from "@/components/AppContext";
import { PersonaModal } from "../../components/PersonaModal";

export default function SettingsPersona() {
  const [personaBundles, setPersonaBundles] = useState<PersonaBundle[]>([]);
  const { createModal, closeModal } = useApp();

  useEffect(() => {
    syncPersonaBundles();
  }, []);

  const syncPersonaBundles = async () => {
    const res = await queries.getAllExtantPersonaBundles();
    if (res.kind == "err") {
      toast.error("Error fetching persona bundle.");
      console.error(res.error);
      return;
    }
    setPersonaBundles(res.value);
  };

  /* Handles user triggering the "new persona" action. */
  const handleNew = () => {
    createModal(
      <PersonaModal
        title="New Persona"
        submit={{
          label: "Create",
          handle: async (data: PersonaFormData) => {
            const res = await window.api.blob.personas.post(data);
            if (res.kind === "ok") {
              toast.success("Persona created successfully.");
              closeModal();
            } else {
              toast.error(`Error creating persona. Error: ${res.error}`);
              console.error(res.error);
            }
            syncPersonaBundles();
          }
        }}
      />
    );
  };

  const handleEdit = (bundle: PersonaBundle) => {
    const name = bundle.data.name;
    const description = bundle.data.description;
    const isDefault = bundle.data.is_default === 1 ? true : false;
    const id = bundle.data.id;

    createModal(
      <PersonaModal
        title="Edit Persona"
        name={name}
        description={description}
        isDefault={isDefault}
        submit={{
          label: "Save",
          handle: async (data: PersonaFormData) => {
            const res = await window.api.blob.personas.put(id, data);
            if (res.kind === "ok") {
              toast.success("Persona updated successfully.");
              closeModal();
            } else {
              toast.error(`Error updating persona. Error: ${res.error}`);
              console.error(res.error);
            }
            syncPersonaBundles();
          }
        }}
        remove={{
          label: "Remove",
          handle: () => {
            closeModal();
            handleDelete(bundle);
          }
        }}
      />
    );
  };

  const handleDelete = async (bundle: PersonaBundle) => {
    const res = await queries.deletePersona(bundle);
    if (res.kind === "ok") {
      toast.success("Persona deleted successfully.");
    } else {
      toast.error("Error deleting persona.");
    }
    syncPersonaBundles();
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-8">
      <h1 className="text-2xl font-bold tracking-wide">Persona Settings</h1>
      {/* Personas List */}
      <div className=" flex max-h-[50%] min-h-24 w-[28rem] rounded-2xl border border-neutral-700 bg-neutral-800 py-2">
        <div className="scroll-secondary flex h-full w-full flex-col space-y-2 overflow-y-scroll px-3">
          {personaBundles.length === 0 && (
            <div className="flex h-full w-full items-center justify-center">
              <p className="select-none text-center text-sm font-[650] text-neutral-600">
                {"You don't have a persona yet..."}
              </p>
            </div>
          )}

          {personaBundles.map((bundle, idx) => {
            return (
              <ContextMenu key={idx}>
                <ContextMenuTrigger>
                  <button
                    className={`group flex h-fit w-full items-center justify-between rounded-lg p-3 font-[480] text-neutral-100 transition duration-200 ease-out hover:bg-neutral-700 focus:outline-none`}
                    onClick={() => handleEdit(bundle)}
                  >
                    <div className="mr-3 flex w-full items-center space-x-5">
                      <img
                        draggable="false"
                        className="size-12 rounded-full object-cover object-top"
                        src={bundle.avatarURI || "default_avatar.png"}
                        alt="Avatar"
                      />
                      <div className="flex w-full flex-col">
                        <h3 className="line-clamp-1 w-5/6 text-ellipsis text-left text-[1.07rem] font-[550]">
                          {bundle.data.name}
                        </h3>
                        {bundle.data.description && bundle.data.description.length != 0 && (
                          <p className="line-clamp-1 text-ellipsis text-left text-[0.88rem] font-[470] text-gray-400">
                            {bundle.data.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisHorizontalIcon className="size-5 shrink-0 cursor-pointer opacity-0 transition duration-75 ease-out group-hover:opacity-100" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={(e) => {
                              // Prevent clicks on the dropdown menu items from triggering the parent button
                              e.stopPropagation();
                            }}
                            onSelect={() => handleEdit(bundle)}
                          >
                            Edit
                            <DropdownMenuShortcut>
                              <WrenchScrewdriverIcon className="size-4" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              // Prevent clicks on the dropdown menu items from triggering the parent button
                              e.stopPropagation();
                            }}
                            onSelect={() => handleDelete(bundle)}
                          >
                            Delete
                            <DropdownMenuShortcut>
                              <WrenchScrewdriverIcon className="size-4" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </button>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-36">
                  <ContextMenuItem onSelect={() => handleEdit(bundle)}>
                    Edit
                    <ContextMenuShortcut>
                      <WrenchScrewdriverIcon className="size-4" />
                    </ContextMenuShortcut>
                  </ContextMenuItem>

                  <ContextMenuItem
                    onSelect={() => {
                      handleDelete(bundle);
                    }}
                  >
                    Delete
                    <ContextMenuShortcut>
                      <WrenchScrewdriverIcon className="size-4" />
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
      </div>
      <button className="flex items-center space-x-2 rounded-md bg-neutral-700 px-4 py-2" onClick={handleNew}>
        <UserPlusIcon className="size-5" />
        <span className="font-medium text-neutral-200">New</span>
      </button>
    </div>
  );
}
