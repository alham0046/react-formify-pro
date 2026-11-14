import type { ArrayField, ArrayItem } from "../store/ArrayStore";
import type { DropdownDependencyField } from "../store/DropdownDepStore";
import type { DropdownField } from "../store/DropdownStore";
import type { FormObject } from "../store/FormObject";
import type { InputField } from "../store/InputFieldStore";
import type { InputForm } from "../store/InputFormStore";

export type FlatFieldNode = InputField | DropdownField | DropdownDependencyField;
export type ContainerFieldNode = ArrayField | FormObject;
export type AnyFieldNode = FlatFieldNode | ContainerFieldNode;
export type NodeWithFields = InputForm | ArrayItem | FormObject;
// export type ParentNode = InputForm | ArrayItem | FormObject;