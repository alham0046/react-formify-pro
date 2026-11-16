"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ArrayContainer: () => ArrayContainer_default,
  AutoInput: () => AutoInput_default,
  DateInput: () => DateInput_default,
  DisabledInput: () => DisabledInput_default,
  FormRow: () => FormRow_default,
  InputContainer: () => InputContainer_default,
  NumInput: () => NumInput_default,
  ObjectContainer: () => ObjContainer_default,
  RunningText: () => RunningText_default,
  SearchInput: () => SearchInput_default,
  SelectInput: () => SelectInput_default,
  StrInput: () => StrInput_default,
  SubmitButton: () => SubmitButton_default,
  sharedMemory: () => sharedMemory,
  stateStyle: () => stateStyle
});
module.exports = __toCommonJS(index_exports);

// #style-inject:#style-inject
function styleInject(css, { insertAt } = {}) {
  if (!css || typeof document === "undefined") return;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

// src/styles.css
styleInject(".input-container input::-webkit-outer-spin-button,\n.input-container input::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.input-container input[type=number] {\n  -moz-appearance: textfield;\n}\n.input-edited {\n  color: #2563eb;\n}\n.input-error {\n  color: #dc2626;\n  border-color: #dc2626;\n}\n.input-warning {\n  border-color: #f59e0b;\n}\n.input-success {\n  border-color: #16a34a;\n}\n");

// src/marquee.css
styleInject('.rt-container {\n  position: relative;\n  overflow: hidden;\n  white-space: nowrap;\n}\n.rt-track {\n  display: inline-flex;\n  gap: 3rem;\n  width: max-content;\n  transform: translateX(0);\n  transition: transform 0.6s ease-out;\n}\n.rt-duplicate {\n  display: none;\n}\n.rt-overflow .rt-track .rt-duplicate {\n  display: block;\n}\n.rt-overflow:not(:hover)::after {\n  content: "...";\n  position: absolute;\n  right: 0;\n  top: 0;\n  height: 100%;\n  padding-left: 1rem;\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      white 60%);\n}\n.rt-overflow:hover .rt-track {\n  animation: rt-scroll var(--rt-speed, 10s) linear infinite;\n}\n.rt-overflow:not(:hover) .rt-track {\n  animation: none;\n  transform: translateX(0);\n}\n@keyframes rt-scroll {\n  from {\n    transform: translateX(0);\n  }\n  to {\n    transform: translateX(var(--rt-distance));\n  }\n}\n');

// src/Select.css
styleInject(".select-container {\n  anchor-name: var(--anchor-name);\n  outline: none;\n}\n.select-options-container > div {\n  min-height: 0;\n  max-height: 188px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  flex: 1 1 auto;\n}\n.select-options-container {\n  position: fixed;\n  position-anchor: var(--anchor-name);\n  width: anchor-size(width);\n  top: anchor(bottom);\n  left: anchor(left);\n  position-try-fallbacks: flip-block;\n}\n@layer base {\n  .field-select-root {\n    outline: none;\n    cursor: pointer;\n  }\n  .select-options-container {\n    background-color: white;\n    z-index: 100;\n    display: flex;\n    flex-direction: column;\n    border: var(--field-border-width) solid black;\n    border-radius: var(--field-radius);\n    overflow: hidden;\n    margin-block-start: var(--select-option-offset-y);\n    box-sizing: border-box;\n    overflow: hidden;\n    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  }\n  .select-option {\n    padding-block: var(--field-padding-y);\n    padding-inline: var(--field-padding-x);\n    font-size: var(--field-font-size);\n    font-weight: var(--field-font-weight);\n    background-color: transparent;\n    cursor: pointer;\n  }\n  .select-option[data-active=true] {\n    background-color: oklch(88.2% 0.059 254.128);\n    outline: none;\n  }\n  .select-option[aria-selected=true] {\n    background-color: #f3f4f6;\n    color: #155dfc;\n  }\n  .select-option[aria-selected=true][data-active=true] {\n    background-color: rgb(140, 140, 197);\n    color: white;\n  }\n  .select-search {\n    flex: 0 0 auto;\n    padding-block: 8px;\n    padding-inline: 10px;\n    border-radius: 4px;\n    background-color: #f3f4f6;\n    color: black;\n    border: var(--field-border-width) solid black;\n    margin-inline: 5px;\n    margin-block: 5px;\n  }\n}\n");

// src/Input.css
styleInject("* {\n  box-sizing: border-box;\n}\n.label-input {\n  position: absolute;\n  height: 100%;\n  left: var(--field-padding-x);\n  top: 0%;\n  display: inline-flex;\n  align-items: center;\n  pointer-events: none;\n  transition: top 200ms ease, transform 200ms ease;\n}\n@layer base {\n  .input-container {\n    --line-bg: white;\n    --field-border-width: 2px;\n    --field-border-color: black;\n    --field-border-focus-color: #2563eb;\n    --field-font-size: 15px;\n    --field-font-weight: 400;\n    --float: 0;\n    --field-height: 42px;\n    --field-padding-x: 16px;\n    --field-padding-y: 10px;\n    --field-radius: 8px;\n    --placeholder-color: #64748b;\n    --placeholder-focus-color: #2563eb;\n    --placeholder-font-weight: 400;\n    --field-background: transparent;\n    --select-option-hover-bg: #e5e7eb;\n    --select-option-selected-bg: #dbeafe;\n    --select-option-hover-color: inherit;\n    --select-option-selected-color: inherit;\n    --select-option-offset-y: 5px;\n    gap: 10px;\n    display: grid;\n  }\n  .field-root {\n    position: relative;\n    width: 100%;\n  }\n  .field-root .template-input .placeholder-input {\n    color: var(--placeholder-color);\n    font-weight: var(--placeholder-font-weight);\n  }\n  .template-input {\n    position: relative;\n    width: 100%;\n  }\n  .field-input {\n    border: var(--field-border-width) solid black;\n    outline-style: none;\n    color: inherit;\n    width: 100%;\n    padding-block: var(--field-padding-y);\n    font-size: var(--field-font-size);\n    font-weight: var(--field-font-weight);\n    border-radius: var(--field-radius);\n    padding-inline: var(--field-padding-x);\n    background-color: transparent;\n    transition: border-color 200ms ease;\n  }\n  .placeholder-input {\n    transform-origin: left center;\n    transform: scale(calc(1 - 0.25 * var(--float))) translateY(calc(-66% * var(--float))) translateX(calc(10% * var(--float)));\n    display: flex;\n    height: 100%;\n    align-items: center;\n    transition: transform 200ms ease;\n    background: transparent;\n  }\n  .line-input {\n    position: absolute;\n    width: 100%;\n    left: -2px;\n    background-color: var(--line-bg);\n    height: var(--field-border-width);\n    top: 0;\n    opacity: calc(var(--float));\n    transition: opacity 200ms ease;\n  }\n  input:focus + .label-input .placeholder-input,\n  input:not(:placeholder-shown) + .label-input .placeholder-input {\n    transform: scale(0.75) translateY(-66%) translateX(10%);\n  }\n  input:focus + .label-input .line-input,\n  input:not(:placeholder-shown) + .label-input .line-input {\n    opacity: 1;\n  }\n}\n");

// src/RunningText.css
styleInject('@layer base {\n  .rt-container {\n    position: relative;\n    overflow: hidden;\n    white-space: nowrap;\n  }\n  .rt-track {\n    display: inline-flex;\n    gap: 3rem;\n    width: max-content;\n    transform: translateX(0);\n    transition: transform 0.6s ease-out;\n  }\n  .rt-duplicate {\n    display: none;\n  }\n  .rt-overflow .rt-track .rt-duplicate {\n    display: block;\n  }\n  .rt-overflow:not(:hover)::after {\n    content: "...";\n    position: absolute;\n    right: 0;\n    top: 0;\n    height: 100%;\n    padding-left: 1rem;\n    background:\n      linear-gradient(\n        to right,\n        transparent,\n        white 60%);\n  }\n  .rt-overflow:hover .rt-track {\n    animation: rt-scroll var(--rt-speed, 10s) linear infinite;\n  }\n  .rt-overflow:not(:hover) .rt-track {\n    animation: none;\n    transform: translateX(0);\n  }\n  @keyframes rt-scroll {\n    from {\n      transform: translateX(0);\n    }\n    to {\n      transform: translateX(var(--rt-distance));\n    }\n  }\n}\n');

// src/Array.css
styleInject("@layer base {\n  .array-container {\n    display: grid;\n    position: relative;\n    gap: inherit;\n  }\n}\n");

// src/components/StrInput.tsx
var import_react8 = require("react");

// src/components/InputTemplate.tsx
var import_react2 = require("react");

// src/context/LabelLayoutContext.ts
var import_react = require("react");
var FormLayoutContext = (0, import_react.createContext)({ labelMode: false });
var useFormLayout = () => (0, import_react.useContext)(FormLayoutContext);

// src/components/InputTemplate.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var InputTemplate = ({
  name,
  children,
  placeholder
  // childType,
  // style,
  // placeholderStyles = "",
}) => {
  const { labelMode } = useFormLayout();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: `template-input`,
      children: [
        children,
        !labelMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "label",
          {
            id: `floating_input_${name}`,
            htmlFor: `floating_input_${name}`,
            className: `
                            label-input
                          `,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "span",
                {
                  className: `line-input`
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `placeholder-input`, children: placeholder })
            ]
          }
        )
      ]
    }
  );
};
var InputTemplate_default = (0, import_react2.memo)(InputTemplate);

// src/components/Input.tsx
var import_react5 = require("react");

// src/components/NativeInput.tsx
var import_react4 = require("react");

// src/hooks/ExternalSyncHooks.ts
var import_react3 = require("react");

// src/store/GlobalOptionStore.ts
var OptionGlobal = class {
  _field = null;
  _filteredOptions = [];
  _highlightedIndex = 0;
  _search = "";
  optionElements = /* @__PURE__ */ new Map();
  optionsListeners = /* @__PURE__ */ new Map();
  prevEl = null;
  activate(field) {
    this.deactivate(this._field);
    console.log("activating");
    this._field = field;
    this._search = "";
    this._filteredOptions = field._options;
    this.optionElements.clear();
  }
  deactivate(field) {
    if (this._field !== field) return;
    this._field = null;
    this._search = "";
    this._filteredOptions = [];
    this._highlightedIndex = 0;
    this.optionElements.clear();
    console.log("deactivating");
  }
  subscribe = (fieldName, cb) => {
    if (!this.optionsListeners.has(fieldName)) {
      this.optionsListeners.set(fieldName, /* @__PURE__ */ new Set());
    }
    this.optionsListeners.get(fieldName).add(cb);
    console.log("the listeners are", this.optionsListeners);
    return () => {
      const listeners = this.optionsListeners.get(fieldName);
      if (!listeners) return;
      listeners.delete(cb);
      this.optionsListeners.delete(fieldName);
    };
  };
  notify(key) {
    this.optionsListeners.get(key)?.forEach((l) => l());
  }
  registerElement(index, el, isSelected, lastIndex) {
    this.optionElements.set(index, el);
    if (isSelected) {
      this._highlightedIndex = index;
      this.highlight(index);
    } else if (lastIndex) {
      if (this._highlightedIndex > 0) return;
      this._highlightedIndex = 0;
      this.highlight(0);
    }
  }
  highlight = (next) => {
    const nextEl = this.optionElements.get(next);
    if (!nextEl) return;
    if (this.prevEl) {
      this.prevEl.removeAttribute("data-active");
    }
    nextEl?.setAttribute("data-active", "true");
    nextEl?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    this.highlightedIndex = next;
    this.prevEl = nextEl;
  };
  setSearch(value) {
    if (this._search === value) return;
    this._highlightedIndex = 0;
    this._search = value;
    this.recomputeOptions();
  }
  recomputeOptions() {
    if (!this._field) return;
    const search = this._search.trim().toLowerCase();
    if (!search) {
      console.log("going to no search");
      this._filteredOptions = this._field?._options;
    } else {
      this._filteredOptions = this._field._options.filter(
        (option) => option.label.toLowerCase().includes(search)
      );
    }
    this.notify(this._field.name);
  }
  set highlightedIndex(v) {
    if (this._highlightedIndex === v) return;
    this._highlightedIndex = v;
  }
  get highlightedIndex() {
    return this._highlightedIndex;
  }
  get field() {
    return this._field;
  }
  get options() {
    return this._filteredOptions;
  }
  select(index) {
    if (this._field) {
      this._field.value = this._filteredOptions[index]?.value;
      console.log("the selected value is", this._field);
      if (this._field.el) {
        this._field.el.focus();
      }
      this._field.close();
    }
  }
  handleKeyDown = (e) => {
    e.stopPropagation();
    const options = this._filteredOptions;
    if (!options.length) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.highlight(
          this._highlightedIndex === options.length - 1 ? 0 : this._highlightedIndex + 1
        );
        break;
      case "ArrowUp":
        console.log("arr up is pressed");
        e.preventDefault();
        this.highlight(
          this._highlightedIndex === 0 ? options.length - 1 : this._highlightedIndex - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        this.select(this._highlightedIndex);
        break;
      case "Escape":
        e.preventDefault();
        this._field?.close();
        break;
      case "Tab":
        this._field?.close();
        break;
    }
  };
  destroy() {
    this.optionElements.clear();
    this.optionsListeners.clear();
  }
};
var GlobalOptionStore = new OptionGlobal();

// src/hooks/ExternalSyncHooks.ts
var useInputValue = (field) => {
  const subscribe = (0, import_react3.useCallback)((cb) => field.subscribe(cb), []);
  return (0, import_react3.useSyncExternalStore)(
    subscribe,
    () => field.value
  );
};
var useIsHidden = (field) => {
  const subscribe = (0, import_react3.useCallback)((cb) => field.root.dependency.subscribe(field.name, "hidden", cb), []);
  return (0, import_react3.useSyncExternalStore)(subscribe, () => field.hidden);
};
var useIsDisabled = (field) => {
  const subscribe = (0, import_react3.useCallback)((cb) => field.root.dependency.subscribe(field.name, "disabled", cb), []);
  return (0, import_react3.useSyncExternalStore)(subscribe, () => field.disabled);
};
var useIsOpen = (field) => {
  const subscribe = (0, import_react3.useCallback)((cb) => field.subscribeToggle(cb), []);
  return (0, import_react3.useSyncExternalStore)(subscribe, () => field.isOpen);
};
var useDropdownLabel = (field) => {
  const subscribe = (0, import_react3.useCallback)((cb) => field.subscribe(cb), []);
  return (0, import_react3.useSyncExternalStore)(
    subscribe,
    () => field.label
  );
};
var useGlobalOptions = (field) => {
  const subscribe = (0, import_react3.useCallback)((cb) => GlobalOptionStore.subscribe(field.name, cb), []);
  return (0, import_react3.useSyncExternalStore)(
    subscribe,
    () => GlobalOptionStore.options
  );
};

// src/components/NativeInput.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var NativeInput = ({ field, fixedValue, inputRef, ...domProps }) => {
  const value = fixedValue ?? useInputValue(field);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { ref: inputRef, value, ...domProps });
};
var NativeInput_default = (0, import_react4.memo)(NativeInput);

// src/components/Input.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var Input = (0, import_react5.forwardRef)(({
  // name,
  field,
  fixedValue,
  maxLength,
  autoFocus = false,
  onBlur,
  onFocus,
  inputStyles = "",
  refRequired = false,
  onKeyDown,
  handleChange,
  onChange,
  onEnterPress,
  disabled,
  placeholder,
  type,
  inputInlineStyle
}, ref) => {
  const inputRef = (0, import_react5.useRef)(null);
  const { labelMode } = useFormLayout();
  const handlePreInput = (e) => {
    const evalue = e.target.value;
    if (maxLength && evalue.length > maxLength) {
      return;
    }
    handleChange?.(evalue);
  };
  const fieldHelpers = (0, import_react5.useMemo)(() => ({
    setFields: (fields) => field.setFields(fields),
    arrayAction: (path) => field.getArray(path),
    reset: (target) => field.reset(target)
  }), [field]);
  (0, import_react5.useImperativeHandle)(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    reset: (keys) => {
      field.reset(keys);
    },
    position: () => {
      return inputRef.current?.getBoundingClientRect();
    }
  }), [field]);
  const handleBlur = () => {
    onBlur?.({
      value: field.value ?? "",
      data: field.root.data,
      ...fieldHelpers
    });
  };
  const handleFocus = () => {
    if (field.displayCode == 3) {
      onFocus?.(field.name, inputRef);
    } else {
      onFocus?.(field.name);
    }
  };
  const handleKeyPresses = (event) => {
    if (event.key === "Enter") {
      onEnterPress?.({
        value: field.value ?? "",
        data: field.root.data,
        stopPropagation: () => event.stopPropagation(),
        ...fieldHelpers
      });
      return;
    }
    onKeyDown?.(event);
  };
  const onChangeRef = (0, import_react5.useRef)(onChange);
  onChangeRef.current = onChange;
  (0, import_react5.useEffect)(() => {
    if (!onChangeRef.current) return;
    const unsub = field.subscribe(() => {
      onChangeRef.current?.({ value: field.value, ...fieldHelpers });
    });
    return () => unsub?.();
  }, [field, fieldHelpers]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    NativeInput_default,
    {
      type,
      id: `floating_input_${field.name}`,
      inputRef,
      onBlur: handleBlur,
      onFocus: handleFocus,
      field,
      fixedValue,
      autoFocus,
      onKeyDown: handleKeyPresses,
      onChange: handlePreInput,
      disabled,
      className: labelMode ? inputStyles : `field-input`,
      placeholder: labelMode ? placeholder : " "
    }
  ) });
});
var Input_default = (0, import_react5.memo)(Input);

// src/context/ContainerContext.ts
var import_react6 = require("react");
var ContainerContext = (0, import_react6.createContext)(void 0);
var useContainerContext = () => {
  const context = (0, import_react6.useContext)(ContainerContext);
  if (!context) {
    throw new Error(
      "useContainerContext must be used inside an InputContainer"
    );
  }
  return context;
};

// src/store/StyleRegistry.ts
var styleCache = /* @__PURE__ */ new Map();
var styleElement = null;
function getStyleSheet() {
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = "input-library-styles";
    document.head.appendChild(styleElement);
  }
  return styleElement;
}
function injectCSS(css) {
  const sheet = getStyleSheet();
  sheet.appendChild(document.createTextNode(css));
}

// src/Utils/StyleInjection.ts
var UNITLESS = /* @__PURE__ */ new Set([
  "opacity",
  "z-index",
  "font-weight",
  "line-height",
  "flex",
  "flex-grow",
  "flex-shrink",
  "order",
  "zoom"
]);
var BASE_SELECTORS = {
  root: ".field-root",
  input: ".field-input",
  placeholder: ".placeholder-input",
  line: ".line-input",
  template: ".template-input",
  options: ".select-options-container",
  option: ".select-option",
  search: ".select-search"
};
var MODIFIER_SELECTORS = {
  focus: ":focus",
  hover: ":hover",
  active: '[data-active="true"]',
  disabled: ":disabled",
  focusWithin: ":focus-within",
  selected: '[aria-selected="true"]'
};
var kebabCache = /* @__PURE__ */ new Map();
function toKebab(str) {
  let cached = kebabCache.get(str);
  if (cached) return cached;
  if (str.startsWith("--")) return str;
  cached = str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  kebabCache.set(str, cached);
  return cached;
}
var objectRefCache = /* @__PURE__ */ new WeakMap();
function hashObject(obj) {
  let hash = 2166136261;
  const targets = Object.keys(obj).sort();
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    if (target === void 0 || target === null) continue;
    const targetStyle = obj[target];
    if (!targetStyle) continue;
    for (let c = 0; c < target.length; c++) {
      hash = (hash ^ target.charCodeAt(c)) * 16777619;
    }
    const keys = Object.keys(targetStyle).sort();
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      if (key === void 0 || key === null) continue;
      const val = targetStyle[key];
      if (val === void 0 || val === null) continue;
      for (let c = 0; c < key.length; c++) {
        hash = (hash ^ key.charCodeAt(c)) * 16777619;
      }
      if (typeof val === "object") {
        const subKeys = Object.keys(val).sort();
        for (let k = 0; k < subKeys.length; k++) {
          const sk = subKeys[k];
          if (sk === void 0 || sk === null) continue;
          const sv = val[sk];
          const entry = `${sk}:${sv}`;
          for (let c = 0; c < entry.length; c++) {
            hash = (hash ^ entry.charCodeAt(c)) * 16777619;
          }
        }
      } else {
        const valStr = String(val);
        for (let c = 0; c < valStr.length; c++) {
          hash = (hash ^ valStr.charCodeAt(c)) * 16777619;
        }
      }
    }
  }
  return (hash >>> 0).toString(36);
}
function buildCSS(className, style) {
  let css = "";
  for (const [target, targetStyle] of Object.entries(style)) {
    if (!targetStyle) continue;
    const baseSelector = BASE_SELECTORS[target];
    if (!baseSelector) continue;
    let direct = "";
    const modifiers = {};
    for (const [key, value] of Object.entries(targetStyle)) {
      if (value === void 0 || value === null) continue;
      const modifier = MODIFIER_SELECTORS[key];
      if (modifier) {
        let modRules = "";
        for (const [subKey, subVal] of Object.entries(value)) {
          if (subVal === void 0 || subVal === null) continue;
          const cssKey = toKebab(subKey);
          const formatted = typeof subVal === "number" && !UNITLESS.has(cssKey) && !cssKey.startsWith("--") ? `${subVal}px` : subVal;
          modRules += `${cssKey}:${formatted};`;
        }
        if (modRules) modifiers[modifier] = modRules;
      } else {
        const cssKey = toKebab(key);
        const formatted = typeof value === "number" && !UNITLESS.has(cssKey) && !cssKey.startsWith("--") ? `${value}px` : value;
        direct += `${cssKey}:${formatted};`;
      }
    }
    if (direct) {
      css += `.${className} ${baseSelector}{${direct}}`;
    }
    for (const [pseudo, rules] of Object.entries(modifiers)) {
      css += `.${className} ${baseSelector}${pseudo}{${rules}}`;
    }
  }
  return css;
}
function getStyleClass(style) {
  if (!style) return "";
  const refMatch = objectRefCache.get(style);
  if (refMatch) return refMatch;
  const hash = hashObject(style);
  const className = `input-style-${hash}`;
  if (styleCache.has(hash)) {
    objectRefCache.set(style, className);
    return className;
  }
  const css = buildCSS(className, style);
  injectCSS(css);
  styleCache.set(hash, className);
  objectRefCache.set(style, className);
  return className;
}
var slotRefCache = /* @__PURE__ */ new WeakMap();
function stateStyle(styles) {
  if (!styles) return "";
  const cached = slotRefCache.get(styles);
  if (cached) return cached;
  const hash = hashObject(styles);
  const className = `opt-slot-${hash}`;
  if (styleCache.has(hash)) {
    slotRefCache.set(styles, className);
    return className;
  }
  let css = "";
  if (styles.base) {
    css += `.${className}{${serializeProps(styles.base)}}`;
  }
  if (styles.active) {
    css += `.select-option[data-active="true"] .${className}{${serializeProps(styles.active)}}`;
  }
  if (styles.selected) {
    css += `.select-option[aria-selected="true"] .${className}{${serializeProps(styles.selected)}}`;
  }
  injectCSS(css);
  styleCache.set(hash, className);
  slotRefCache.set(styles, className);
  return className;
}
function serializeProps(styles) {
  let rules = "";
  for (const [key, val] of Object.entries(styles)) {
    if (val === void 0 || val === null) continue;
    const cssKey = toKebab(key);
    const formatted = typeof val === "number" && !UNITLESS.has(cssKey) && !cssKey.startsWith("--") ? `${val}px` : val;
    rules += `${cssKey}:${formatted};`;
  }
  return rules;
}

// src/context/NameScopeContext.ts
var import_react7 = require("react");
var NameScopeContext = (0, import_react7.createContext)(null);
var useNameScope = () => (0, import_react7.useContext)(NameScopeContext);

// src/functions/camelCase.ts
var camelCase = (str) => {
  if (str == "_id") return str;
  if (/^[a-z][a-zA-Z0-9]*$/.test(str)) return str;
  const lowerStr = str.toLowerCase();
  return lowerStr.replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase()).replace(/^[A-Z]/, (match) => match.toLowerCase());
};
var fromCamelCase = (str) => {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
};

// src/Utils/NodeResolver.ts
function resolveTargetNode(startNode, path) {
  if (!path) return void 0;
  let current;
  if (path.startsWith("/")) {
    current = startNode.root;
    path = path.slice(1);
  } else {
    current = startNode.parent ?? startNode;
  }
  const walkUp = path.split("/");
  const tokenPostion = walkUp.length - 1;
  const tokens = walkUp[tokenPostion].split(".");
  if (tokenPostion > 0) {
    for (let i = 0; i < tokenPostion; i++) {
      current = current?.parent ?? current;
    }
  }
  for (let i = 0; i < tokens.length; i++) {
    if (!current) return void 0;
    const token = tokens[i];
    if (current instanceof ArrayField) {
      if (!isNaN(Number(token))) {
        const idx = Number(token);
        current = current.items[idx];
        continue;
      }
    } else {
      current = current?.fields.get(token);
    }
  }
  return current;
}

// src/store/FormNode.ts
var FormNode = class {
  constructor(name, root) {
    this.name = name;
    this.root = root;
  }
  name;
  root;
  /**
  * Prototype-level setValue: Single shared function across all nodes.
  * Can accept:
  * - Dictionary: setValue({ "city": "Ranchi", "age": 25 })
  * - Single path: setValue("user.name", "John")
  */
  setValue(target, value) {
    if (target !== null && typeof target === "object") {
      for (const [key, val] of Object.entries(target)) {
        this.setSingleValue(key, val);
      }
      return;
    }
    if (typeof target === "string") {
      this.setSingleValue(target, value);
    }
  }
  setSingleValue(targetPath, newValue) {
    if (!targetPath.includes("/") && !targetPath.includes(".")) {
      const container = this.fields ? this : this.parent;
      const sibling = container?.fields?.get(targetPath);
      if (sibling) {
        if (sibling.isFlat) {
          sibling.value = newValue;
        } else {
          sibling.setValue(newValue);
        }
        return;
      }
    }
    const node = resolveTargetNode(this, targetPath);
    if (!node) return;
    if (node.isFlat) {
      node.value = newValue;
    } else {
      node.setValue(newValue);
    }
  }
  resetByKey(key) {
    if (Array.isArray(key)) {
      key.forEach((k) => {
        const node = resolveTargetNode(this, k);
        if (node) node.reset();
      });
    } else {
      const node = resolveTargetNode(this, key);
      if (node) node.reset();
    }
  }
};

// src/store/ContainerNode.ts
var ContainerNode = class extends FormNode {
  fields = /* @__PURE__ */ new Map();
  /**
   * Universal recursive populator used by Root, FormObject, and ArrayItem
   */
  populate(initialData) {
    if (!initialData || typeof initialData !== "object") return;
    for (const [name, value] of Object.entries(initialData)) {
      if (Array.isArray(value)) {
        const array = this.createArray(name);
        for (const item of value) {
          array.addItem({ initialValue: item });
        }
        continue;
      }
      if (value !== null && typeof value === "object") {
        const object = this.createObject(name);
        object.populate(value);
        continue;
      }
      this.createField(name, value);
    }
  }
};

// src/functions/dataTypesValidation.ts
var isArray = (arr) => Array.isArray(arr);
var isPlainObject = (obj) => typeof obj === "object" && obj !== null && !isArray(obj);

// src/store/InputFieldStore.ts
var fieldCode = {
  StrInput: 0,
  NumInput: 1,
  SelectInput: 2,
  DateInput: 3,
  DisabledInput: 4,
  ArrayInput: 5,
  ObjectInput: 6,
  SelectDependentInput: 7,
  SearchInput: 8
};
var InputField = class extends FormNode {
  // private _dataParent: Record<string, any>
  // public dependency: DependencyStoreType | null = null
  // private hasRegisteredHidden : boolean = false
  // private hasRegisteredDisabled : boolean = false
  // public validators: Validator[]
  constructor(name, value, parent, _dataParent) {
    super(name, parent.root);
    this.parent = parent;
    this._dataParent = _dataParent;
    this._value = value;
    this._initialValue = value;
    this._dataParent[name] = this._value;
  }
  parent;
  _dataParent;
  // public name: string
  _value = "";
  _initialValue = "";
  error = null;
  _inputCode = 0;
  isFlat = true;
  //// defines if the input has a string value or not
  _touched = false;
  dirty = false;
  _disabled = false;
  _hidden = false;
  privacy = false;
  required = false;
  // setDependency(dependency: DependencyStoreType) { this.dependency = dependency }
  listeners = /* @__PURE__ */ new Set();
  subscribe = (cb) => {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  };
  notify() {
    this.listeners.forEach((l) => l());
  }
  // Called if initialData arrives after field instantiation
  syncInitialValue(value) {
    this._value = value;
    this._initialValue = value;
    this.dirty = false;
    this._dataParent[this.name] = value;
  }
  set value(v) {
    if (this._value === v) return;
    this._value = v;
    if (this.root.mode === "edit") {
      const isNowDirty = v !== this._initialValue;
      if (this.dirty !== isNowDirty) {
        this.dirty = isNowDirty;
        this.root.markFieldDirty(this, isNowDirty);
      }
    }
    this.root.dependency.notifyDependencyChanged(this.name);
    this.notify();
    this._dataParent[this.name] = v;
  }
  //// THIS CODE IS FOR TRACKING VALUE WITHOUT A FORM(<InputContainer>)
  // set value(v: any) {
  //     if (this._value === v) return
  //     this._value = v
  //     if (!this.root) {
  //         this.notify()
  //         return
  //     }
  //     // Track dirty state only when form is in "edit" mode
  //     if (this.root.mode === "edit") {
  //         const isNowDirty = v !== this._initialValue
  //         if (this.dirty !== isNowDirty) {
  //             this.dirty = isNowDirty
  //             this.root.markFieldDirty(this, isNowDirty)
  //         }
  //     }
  //     this.root.dependency.notifyDependencyChanged(this.name)
  //     this.notify()
  //     this._dataParent![this.name] = v
  //     // console.log('the formvalue is', this.formData)
  // }
  set touched(v) {
    this._touched = v;
  }
  set disabled(v) {
    this._disabled = v;
  }
  set hidden(v) {
    v ? this.hide() : this.show();
  }
  set displayCode(displayName) {
    this._inputCode = fieldCode[displayName];
  }
  hide() {
    if (this._hidden) return;
    delete this._dataParent[this.name];
    this._hidden = true;
  }
  show() {
    if (!this._hidden) return;
    this._dataParent[this.name] = this._value;
    this._hidden = false;
  }
  get hidden() {
    return this._hidden;
  }
  get displayCode() {
    return this._inputCode;
  }
  // get displayName() {
  //     return Object.keys(fieldCode).find(key => fieldCode[key] === this._inputCode)
  // }
  get value() {
    return this._value;
  }
  // -------------------------
  // PARENT
  // -------------------------
  // get parent() {
  //     return this._parent
  // }
  // -------------------------
  // PATH
  // -------------------------
  getPath() {
    const parentPath = getNodePath(this.parent);
    return parentPath ? `${parentPath}.${this.name}` : this.name;
  }
  // getArray = (path?: string): (ArrayController & { currentIndex: number | undefined }) | undefined => {
  //     const parent = this.parent
  //     const currentIndex = parent instanceof ArrayItem ? parent.index : undefined
  //     if (!path) return parent instanceof ArrayItem ? {...parent.array.controller, currentIndex} : undefined
  //     const node = resolveTargetNode(this, path);
  //     return node instanceof ArrayField ? {...node.controller, currentIndex} : undefined;
  // };
  getArray(path) {
    let curr = this.parent;
    let enclosingItem;
    while (curr) {
      if (curr instanceof ArrayItem) {
        enclosingItem = curr;
        break;
      }
      curr = curr.parent;
    }
    const currentIndex = enclosingItem?.index;
    const targetArray = !path ? enclosingItem?.array : resolveTargetNode(this, path);
    if (!(targetArray instanceof ArrayField)) return void 0;
    const scopedController = Object.create(targetArray.controller);
    scopedController.currentIndex = currentIndex;
    return scopedController;
  }
  setFields = (fields) => {
    this.setValue(fields);
  };
  reset(key) {
    const isCurrentNode = key === this.name;
    if (!key || isCurrentNode) {
      this.value = this._initialValue;
    } else {
      this.resetByKey(key);
    }
  }
  // setValue = (target: string | Record<string, any>, value?: any) => {
  //     // 1. Batch dictionary update
  //     if (target !== null && typeof target === 'object') {
  //         for (const [key, val] of Object.entries(target)) {
  //             this.setSingleValue(key, val)
  //         }
  //         return
  //     }
  //     // 2. Single key update
  //     if (typeof target === 'string') {
  //         this.setSingleValue(target, value)
  //     }
  // }
  // private setSingleValue(targetPath: string, newValue: any) {
  //     // Ultra-fast path for immediate siblings without slashes or dots: "city"
  //     if (!targetPath.includes('/') && !targetPath.includes('.')) {
  //         // console.log('immediate sibling', targetPath, newValue)
  //         const sibling = (this.parent as NodeWithFields)?.fields?.get(targetPath) ?? (this.parent as NodeWithFields)?.field?.(targetPath)
  //         if (!sibling) return
  //         if (sibling.isFlat) {
  //             sibling.value = newValue
  //         } else sibling.setValue(newValue)
  //         // if (sibling) {
  //         //     if ('value' in sibling) sibling.value = newValue
  //         //     else if (sibling instanceof ArrayField) {
  //         //         // console.log('array sibling', sibling)
  //         //         sibling.setValue(newValue)
  //         //     }
  //         //     return
  //         // }
  //     }
  //     // Traverse relative/nested path
  //     const node = resolveTargetNode(this, targetPath)
  //     if (!node) return
  //     if (node.isFlat) {
  //         node.value = newValue
  //     } else node.setValue(newValue)
  // }
};

// src/store/DropdownStore.ts
var DropdownField = class extends FormNode {
  constructor(name, value, options, parent, _dataParent, defaultLabel = "Select", includeDefaultLabel = false) {
    super(name, parent?.root || null);
    this.parent = parent;
    this._dataParent = _dataParent;
    this.defaultLabel = defaultLabel;
    this.includeDefaultLabel = includeDefaultLabel;
    this._value = value || "";
    this._initialValue = value || "";
    if (this._dataParent) this._dataParent[name] = this._value;
    if (options) this.options = options;
    this.label = this.valueOptionMap.get(value)?.label || this.defaultLabel;
  }
  parent;
  _dataParent;
  defaultLabel;
  includeDefaultLabel;
  _value = "";
  _initialValue = "";
  label = "";
  dirty = false;
  _inputel = null;
  _inputCode = 2;
  _options = [];
  valueOptionMap = /* @__PURE__ */ new Map();
  _disabled = false;
  _hidden = false;
  _isOpen = false;
  isFlat = true;
  listeners = /* @__PURE__ */ new Set();
  toggleListener = /* @__PURE__ */ new Set();
  optionsListeners = /* @__PURE__ */ new Set();
  subscribe = (cb) => {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  };
  subscribeToggle = (cb) => {
    this.toggleListener.add(cb);
    return () => {
      this.toggleListener.delete(cb);
    };
  };
  subscribeOptions = (cb) => {
    this.optionsListeners.add(cb);
    return () => {
      this.optionsListeners.delete(cb);
    };
  };
  notify() {
    this.listeners.forEach((l) => l());
  }
  notifyToggle() {
    this.toggleListener.forEach((l) => l());
  }
  // Called if initialData arrives after field instantiation
  syncInitialValue(value) {
    this._value = value;
    this._initialValue = value;
    this.dirty = false;
    this._dataParent[this.name] = value;
  }
  pushOptions(options) {
    if (!isArray(options)) return;
    if (typeof options[0] === "string") {
      for (const option of options) {
        this._options.push({ value: option, label: option });
        this.valueOptionMap.set(option, { value: option, label: option });
      }
    } else {
      for (const option of options) {
        this._options.push(option);
        this.valueOptionMap.set(option.value, option);
      }
    }
  }
  insertOption(option, atIndex) {
    if (atIndex === void 0 || atIndex < 0) {
      this._options.push(option);
      return;
    }
    this._options.splice(atIndex, 0, option);
    this.valueOptionMap.set(option.value, option);
  }
  removeOption(value) {
    this._options = this._options.filter((opt) => opt.value !== value);
    this.valueOptionMap.delete(value);
  }
  set options(options) {
    if (!isArray(options)) return;
    let initOptions = [];
    if (this.includeDefaultLabel) initOptions.push({ value: "", label: this.defaultLabel });
    if (typeof options[0] === "string") {
      for (const option of options) {
        initOptions.push({ value: option, label: option });
      }
    } else if (options[0] && "value" in options[0] && "label" in options[0]) {
      initOptions = options;
    } else {
      for (const item of options) {
        const val = item.id ?? item.value ?? item;
        const lbl = item.label ?? item.title ?? item.name ?? String(val);
        initOptions.push({ value: val, label: lbl, raw: item });
      }
    }
    this._options = initOptions;
    initOptions.forEach((opt) => {
      this.valueOptionMap.set(opt.value, opt);
    });
  }
  set el(el) {
    this._inputel = el;
  }
  get el() {
    return this._inputel;
  }
  open() {
    if (this._isOpen === true || this._disabled) return;
    this._isOpen = true;
    console.log("opening activate");
    GlobalOptionStore.activate(this);
    this.notifyToggle();
  }
  close() {
    if (this._isOpen === false) return;
    this._isOpen = false;
    console.log("closing deactivate");
    GlobalOptionStore.deactivate(this);
    this.notifyToggle();
  }
  toggle() {
    if (this._isOpen) this.close();
    else this.open();
  }
  get isOpen() {
    return this._isOpen;
  }
  set value(v) {
    if (this._value === v) return;
    this._value = v;
    this.label = this.valueOptionMap.get(v)?.label || this.defaultLabel;
    if (!this.root) {
      this.notify();
      return;
    }
    if (this.root.mode === "edit") {
      const isNowDirty = v !== this._initialValue;
      if (this.dirty !== isNowDirty) {
        this.dirty = isNowDirty;
        this.root.markFieldDirty(this, isNowDirty);
      }
    }
    this.root.dependency.notifyDependencyChanged(this.name);
    this.notify();
    this._dataParent[this.name] = v;
  }
  set displayCode(displayName) {
    this._inputCode = fieldCode[displayName];
  }
  // getArray = (path?: string): ArrayController | undefined => {
  //     const node = resolveTargetNode(this, path);
  //     return node instanceof ArrayField ? node.controller : undefined;
  // };
  getArray(path) {
    let curr = this.parent;
    let enclosingItem;
    while (curr) {
      if (curr instanceof ArrayItem) {
        enclosingItem = curr;
        break;
      }
      curr = curr.parent;
    }
    const currentIndex = enclosingItem?.index;
    const targetArray = !path ? enclosingItem?.array : resolveTargetNode(this, path);
    if (!(targetArray instanceof ArrayField)) return void 0;
    const scopedController = Object.create(targetArray.controller);
    scopedController.currentIndex = currentIndex;
    return scopedController;
  }
  getPath() {
    const parentPath = getNodePath(this.parent);
    return parentPath ? `${parentPath}.${this.name}` : this.name;
  }
  setFields = (fields) => {
    this.setValue(fields);
  };
  reset(key) {
    const isCurrentNode = key === this.name;
    if (!key || isCurrentNode) {
      this.value = this._initialValue;
    } else {
      if (Array.isArray(key)) {
        key.forEach((k) => {
          const node = resolveTargetNode(this, k);
          if (node) node.reset();
        });
      } else {
        const node = resolveTargetNode(this, key);
        if (node) node.reset();
      }
    }
  }
  // setValue = (target: string | Record<string, any>, value?: any) => {
  //     // 1. Batch dictionary update
  //     if (target !== null && typeof target === 'object') {
  //         for (const [key, val] of Object.entries(target)) {
  //             this.setSingleValue(key, val)
  //         }
  //         return
  //     }
  //     // 2. Single key update
  //     if (typeof target === 'string') {
  //         this.setSingleValue(target, value)
  //     }
  // }
  // private setSingleValue(targetPath: string, newValue: any) {
  //     // Ultra-fast path for immediate siblings without slashes or dots: "city"
  //     if (!targetPath.includes('/') && !targetPath.includes('.')) {
  //         // console.log('immediate sibling', targetPath, newValue)
  //         const sibling = (this.parent as NodeWithFields)?.fields?.get(targetPath) ?? (this.parent as NodeWithFields)?.field?.(targetPath)
  //         if (!sibling) return
  //         if (sibling.isFlat) {
  //             sibling.value = newValue
  //         } else sibling.setValue(newValue)
  //     }
  //     // Traverse relative/nested path
  //     const node = resolveTargetNode(this, targetPath)
  //     if (!node) return
  //     if (node.isFlat) {
  //         node.value = newValue
  //     } else node.setValue(newValue)
  // }
  get value() {
    return this._value;
  }
  set hidden(v) {
    v ? this.hide() : this.show();
  }
  get hidden() {
    return this._hidden;
  }
  set disabled(v) {
    this._disabled = v;
  }
  get disabled() {
    return this._disabled;
  }
  get displayCode() {
    return this._inputCode;
  }
  hide() {
    if (this._hidden) return;
    delete this._dataParent[this.name];
    this._hidden = true;
  }
  show() {
    if (!this._hidden) return;
    this._dataParent[this.name] = this._value;
    this._hidden = false;
  }
};

// src/store/FormObject.ts
var FormObject = class _FormObject extends ContainerNode {
  constructor(name, parent, parentData) {
    super(name, parent.root);
    this.parent = parent;
    this.data = {};
    parentData[name] = this.data;
  }
  parent;
  fields = /* @__PURE__ */ new Map();
  _hidden = false;
  _disabled = false;
  isFlat = false;
  data;
  field(name) {
    return this.fields.get(name);
  }
  set hidden(v) {
    this._hidden = v;
  }
  get hidden() {
    return this._hidden;
  }
  set disabled(v) {
    this._disabled = v;
  }
  initialize(initialValue) {
    this.populate(initialValue);
  }
  createField(name, initialValue = "") {
    const existing = this.fields.get(name);
    if (existing instanceof InputField) {
      existing.value = initialValue;
      return existing;
    }
    const field = new InputField(
      name,
      initialValue,
      this,
      this.data
    );
    this.fields.set(name, field);
    return field;
  }
  createObject(name) {
    const existing = this.fields.get(name);
    if (existing instanceof _FormObject) {
      return existing;
    }
    const object = new _FormObject(
      name,
      this,
      this.data
    );
    this.fields.set(name, object);
    return object;
  }
  createDropdown(name, options, initialValue = "", initialLabel = "Select", includeDefaultLabel = false) {
    const existing = this.fields.get(name);
    if (existing instanceof DropdownField) {
      existing.options = options;
      return existing;
    }
    const field = new DropdownField(
      name,
      initialValue,
      options,
      this,
      this.data,
      initialLabel,
      includeDefaultLabel
    );
    this.fields.set(name, field);
    return field;
  }
  createDependentDropdown(name, options, initialValue = "", initialLabel = "Select", includeDefaultLabel = false, dependsOn) {
    const existing = this.fields.get(name);
    if (existing instanceof DropdownDependencyField) {
      existing.options = options;
      return existing;
    }
    const field = new DropdownDependencyField(
      name,
      initialValue,
      options,
      this,
      this.data,
      initialLabel,
      includeDefaultLabel,
      dependsOn
    );
    this.fields.set(name, field);
    return field;
  }
  createArray(name) {
    const existing = this.fields.get(name);
    if (existing instanceof ArrayField) {
      return existing;
    }
    const array = new ArrayField(
      name,
      this,
      this.data
    );
    this.fields.set(name, array);
    return array;
  }
  setValue(objectValue) {
    for (const [name, value] of Object.entries(objectValue)) {
      const field = this.fields.get(name);
      if (!field) continue;
      if (field.isFlat) {
        field.value = value;
      } else {
        field.setValue(value);
      }
    }
  }
  reset() {
    for (const field of this.fields.values()) {
      field.reset();
    }
  }
};

// src/Utils/extractDeps.ts
var DEPENDENCY_REGEX = /\$\{([^}]+)\}/g;
function extractDependencies(expression) {
  const dependencies = /* @__PURE__ */ new Set();
  for (const match of expression.matchAll(DEPENDENCY_REGEX)) {
    dependencies.add(match[1].trim());
  }
  return [...dependencies];
}

// src/store/DependencyStore.ts
var DependencyStore = class {
  ///// field -> property(hidden/disabled) -> listener
  constructor(form) {
    this.form = form;
  }
  form;
  nodes = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Map();
  subscribe(field, property, cb) {
    if (!this.listeners.has(field)) {
      this.listeners.set(field, /* @__PURE__ */ new Map());
    }
    if (!this.listeners.get(field).has(property)) {
      this.listeners.get(field).set(property, /* @__PURE__ */ new Set());
    }
    this.listeners.get(field).get(property).add(cb);
    return () => {
      if (!this.listeners.has(field)) return;
      if (this.listeners.get(field).has(property)) {
        this.listeners.get(field).get(property).delete(cb);
      }
    };
  }
  notify(field, property) {
    this.listeners.get(field).get(property).forEach((l) => l());
  }
  register(field, property, expression) {
    const dependencies = extractDependencies(expression);
    for (const dep of dependencies) {
      let list = this.nodes.get(dep) ?? [];
      list.push({ field, property, expression });
      this.nodes.set(dep, list);
    }
  }
  notifyDependencyChanged(dependency) {
    const nodes = this.nodes.get(dependency);
    if (!nodes) {
      return;
    }
    for (const node of nodes) {
      this.recompute(node);
    }
  }
  recompute(node) {
    const field = this.form.field(node.field);
    if (!field) {
      return;
    }
    const value = this.evaluate(node.expression);
    if (node.property === "hidden") {
      if (field.hidden === value) {
        return;
      }
      field.hidden = value;
      console.log("the node is", node, value);
      this.notify(node.field, "hidden");
    }
    if (node.property === "disabled") {
      field.disabled = value;
      this.notify(node.field, "disabled");
    }
  }
  evaluate(expression) {
    const resolvedExpression = expression.replace(
      /\$\{([^}]+)\}/g,
      (_, key) => {
        const field = this.form.field(key.trim());
        if (!field) {
          return "";
        }
        if (!field.isFlat) {
          return "";
        }
        const value = field.value;
        return JSON.stringify(value);
      }
    );
    try {
      return Boolean(
        Function(`"use strict"; return (${resolvedExpression})`)()
      );
    } catch (error) {
      console.error(
        "Failed to evaluate dependency:",
        expression,
        resolvedExpression,
        error
      );
      return false;
    }
  }
  hasNode(name) {
    return this.nodes.has(name);
  }
  clear() {
    this.nodes.clear();
    this.listeners.clear();
  }
};

// src/store/InputFormStore.ts
var InputForm = class extends ContainerNode {
  // private editedData: Record<string, any> = {}
  constructor(formId) {
    super("root", null);
    this.formId = formId;
    this.root = this;
    this.dependency = new DependencyStore(this);
  }
  formId;
  dependency;
  mode = "default";
  data = {};
  parent = null;
  isFlat = false;
  dirtyFields = /* @__PURE__ */ new Set();
  dirtyArrays = /* @__PURE__ */ new Set();
  hiddenFields = /* @__PURE__ */ new Set();
  disabledFields = /* @__PURE__ */ new Set();
  // private inputFields = new Map<string, InputFieldType>()
  fields = /* @__PURE__ */ new Map();
  //// Initialize the form. Mainly sets the mode and initial data
  initializeForm(mode = "default", initialData) {
    this.mode = mode;
    this.populate(initialData);
  }
  createField(name, initialValue = "") {
    const existing = this.fields.get(name);
    if (existing instanceof InputField) {
      existing.value = initialValue;
      return existing;
    }
    const field = new InputField(
      name,
      initialValue,
      this,
      this.data
    );
    this.fields.set(name, field);
    this.data[name] = initialValue;
    return field;
  }
  createDropdown(name, options, initialValue = "", initialLabel = "Select", includeDefaultLabel = false) {
    const existing = this.fields.get(name);
    if (existing instanceof DropdownField) {
      existing.options = options;
      return existing;
    }
    const field = new DropdownField(
      name,
      initialValue,
      options,
      this,
      this.data,
      initialLabel,
      includeDefaultLabel
    );
    this.fields.set(name, field);
    return field;
  }
  createDependentDropdown(name, options, initialValue = "", initialLabel = "Select", includeDefaultLabel = false, dependsOn) {
    const existing = this.fields.get(name);
    if (existing instanceof DropdownDependencyField) {
      existing.options = options;
      return existing;
    }
    const field = new DropdownDependencyField(
      name,
      initialValue,
      options,
      this,
      this.data,
      initialLabel,
      includeDefaultLabel,
      dependsOn
    );
    this.fields.set(name, field);
    return field;
  }
  createObject(name) {
    const existing = this.fields.get(name);
    if (existing instanceof FormObject) {
      return existing;
    }
    const object = new FormObject(name, this, this.data);
    this.fields.set(name, object);
    return object;
  }
  field(name) {
    return this.fields.get(name);
  }
  createArray(name) {
    const existing = this.fields.get(name);
    if (existing instanceof ArrayField) {
      return existing;
    }
    const array = new ArrayField(name, this, this.data);
    this.fields.set(name, array);
    return array;
  }
  get formData() {
    return this.data;
  }
  registerHidden(field, expression) {
    if (this.hiddenFields.has(field.name)) return;
    if (typeof expression === "boolean") {
      field.hidden = expression;
    } else if (typeof expression === "string") {
      this.dependency.register(field.name, "hidden", expression);
    }
    this.hiddenFields.add(field.name);
  }
  registerDisabled(field, expression) {
    if (this.disabledFields.has(field.name)) return;
    if (typeof expression === "boolean") {
      field.disabled = expression;
    } else if (typeof expression === "string") {
      this.dependency.register(field.name, "disabled", expression);
    }
    this.disabledFields.add(field.name);
  }
  reset(key) {
    if (key) {
      this.resetByKey(key);
      return;
    }
    const fields = Array.from(this.fields.values());
    for (const field of fields) {
      field.reset();
    }
  }
  clear() {
    this.fields.clear();
    this.data = {};
    this.dirtyFields.clear();
    this.dirtyArrays.clear();
    this.hiddenFields.clear();
    this.disabledFields.clear();
    this.dependency.clear();
  }
  // public setFields = (fields: FieldProps) => {
  //   this.setInternalValue(fields, this)
  // }
  setFields = (fields) => {
    this.setValue(fields);
  };
  /**
   * Called by InputField / DropdownField when its value diverges from _initialValue
   */
  markFieldDirty(field, isDirty) {
    if (this.mode !== "edit") return;
    if (isDirty) {
      this.dirtyFields.add(field);
    } else {
      this.dirtyFields.delete(field);
    }
  }
  /**
   * Called by ArrayField when items are added, removed, or cleared in edit mode
   */
  markArrayDirty(array) {
    if (this.mode !== "edit") return;
    this.dirtyArrays.add(array);
  }
  get isDirty() {
    return this.dirtyFields.size > 0 || this.dirtyArrays.size > 0;
  }
  /**
   * Builds a clean nested object containing ONLY modified fields/arrays.
   * Computed lazily on submit so keystrokes stay O(1).
   */
  getEditedData() {
    if (this.mode !== "edit") return {};
    const edited = {};
    for (const field of this.dirtyFields) {
      if (field.hidden) continue;
      const path = field.getPath();
      setByDotPath(edited, path, field.value);
    }
    for (const array of this.dirtyArrays) {
      const path = getNodePath(array);
      setByDotPath(edited, path, array.data);
    }
    return edited;
  }
  /**
   * 2. MongoDB-ready dot-notation format (safe for $set in findByIdAndUpdate):
   *    { title: "New Movie", "meta.quality": "4K", "playlink.0.host": "cdn2" }
   */
  getFlatEditedData() {
    if (this.mode !== "edit") return {};
    const flatPatch = {};
    for (const field of this.dirtyFields) {
      if (field.hidden) continue;
      const path = field.getPath();
      if (this.isInsideDirtyArray(field)) continue;
      flatPatch[path] = field.value;
    }
    for (const array of this.dirtyArrays) {
      const path = getNodePath(array);
      flatPatch[path] = array.data;
    }
    return flatPatch;
  }
  isInsideDirtyArray(field) {
    let curr = field.parent;
    while (curr) {
      if (curr instanceof ArrayField && this.dirtyArrays.has(curr)) {
        return true;
      }
      curr = curr.parent;
    }
    return false;
  }
  /**
   * Call after successful API save to reset dirty tracking to current values
   */
  commitEdits() {
    for (const field of this.dirtyFields) {
      field.syncInitialValue(field.value);
    }
    this.dirtyFields.clear();
    this.dirtyArrays.clear();
  }
};

// src/Utils/PathUtils.ts
function getNodePath(node) {
  if (node instanceof InputForm) {
    return "";
  }
  if (node instanceof ArrayItem) {
    const parentPath = getNodePath(node.array);
    const index = node.index;
    return parentPath ? `${parentPath}.${index}` : String(index);
  }
  if (node instanceof FormObject) {
    const parentPath = getNodePath(node.parent);
    return parentPath ? `${parentPath}.${node.name}` : node.name;
  }
  if (node instanceof ArrayField) {
    const parentPath = getNodePath(node.parent);
    return parentPath ? `${parentPath}.${node.name}` : node.name;
  }
  return "";
}
function setByDotPath(target, path, value) {
  const keys = path.split(".");
  let current = target;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    if (key === void 0 || key === null) continue;
    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      current[key] = !isNaN(Number(nextKey)) ? [] : {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

// src/store/DropdownDepStore.ts
var DropdownDependencyField = class extends FormNode {
  constructor(name, value, options, parent, _dataParent, defaultLabel = "Select", includeDefaultLabel = false, dependsOn) {
    super(name, parent.root);
    this.parent = parent;
    this._dataParent = _dataParent;
    this.defaultLabel = defaultLabel;
    this.includeDefaultLabel = includeDefaultLabel;
    this._value = value || "";
    this._initialValue = value || "";
    this._dataParent[name] = this._value;
    if (options) this.options = options;
    this.label = this.valueOptionMap.get(this._value)?.label || this.defaultLabel;
    const depField = resolveTargetNode(this, dependsOn);
    this._dependentField = depField;
  }
  parent;
  _dataParent;
  defaultLabel;
  includeDefaultLabel;
  _value = "";
  _initialValue = "";
  label = "";
  dirty = false;
  _inputel = null;
  _cascadeOptionMap = /* @__PURE__ */ new Map();
  _options = [];
  valueOptionMap = /* @__PURE__ */ new Map();
  _disabled = false;
  _hidden = false;
  _isOpen = false;
  _inputCode = 7;
  isFlat = true;
  _dependentField;
  listeners = /* @__PURE__ */ new Set();
  toggleListener = /* @__PURE__ */ new Set();
  optionsListeners = /* @__PURE__ */ new Set();
  subscribe = (cb) => {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  };
  subscribeToggle = (cb) => {
    this.toggleListener.add(cb);
    return () => {
      this.toggleListener.delete(cb);
    };
  };
  subscribeOptions = (cb) => {
    this.optionsListeners.add(cb);
    return () => {
      this.optionsListeners.delete(cb);
    };
  };
  notify() {
    this.listeners.forEach((l) => l());
  }
  notifyToggle() {
    this.toggleListener.forEach((l) => l());
  }
  // Called if initialData arrives after field instantiation
  syncInitialValue(value) {
    this._value = value;
    this._initialValue = value;
    this.dirty = false;
    this._dataParent[this.name] = value;
  }
  set options(cascadeOptions) {
    for (const [parent, options] of Object.entries(cascadeOptions)) {
      let initOptions = [];
      if (this.includeDefaultLabel) initOptions.push({ value: "", label: this.defaultLabel });
      if (typeof options[0] === "string") {
        for (const option of options) {
          initOptions.push({ value: option, label: option });
        }
      } else {
        initOptions = options;
      }
      this._cascadeOptionMap.set(parent, initOptions);
      initOptions.forEach((opt) => {
        this.valueOptionMap.set(opt.value, opt);
      });
    }
  }
  set el(el) {
    this._inputel = el;
  }
  get el() {
    return this._inputel;
  }
  open() {
    if (this._isOpen === true || this._disabled) return;
    this._isOpen = true;
    GlobalOptionStore.activate(this);
    this.notifyToggle();
  }
  close() {
    if (this._isOpen === false) return;
    this._isOpen = false;
    GlobalOptionStore.deactivate(this);
    this.notifyToggle();
  }
  toggle() {
    if (this._isOpen) this.close();
    else this.open();
  }
  get isOpen() {
    return this._isOpen;
  }
  set value(v) {
    if (this._value === v) return;
    this._value = v;
    this.label = this.valueOptionMap.get(v)?.label || "";
    this.root.dependency.notifyDependencyChanged(this.name);
    this.notify();
    this._dataParent[this.name] = v;
  }
  get value() {
    return this._value;
  }
  set hidden(v) {
    v ? this.hide() : this.show();
  }
  get hidden() {
    return this._hidden;
  }
  set disabled(v) {
    this._disabled = v;
  }
  get disabled() {
    return this._disabled;
  }
  get displayCode() {
    return this._inputCode;
  }
  getPath() {
    const parentPath = getNodePath(this.parent);
    return parentPath ? `${parentPath}.${this.name}` : this.name;
  }
  getArray = (path) => {
    const node = resolveTargetNode(this, path);
    return node instanceof ArrayField ? node.controller : void 0;
  };
  setFields = (fields) => {
    this.setValue(fields);
  };
  reset(key) {
    const isCurrentNode = key === this.name;
    if (!key || isCurrentNode) {
      this.value = this._initialValue;
    } else {
      if (Array.isArray(key)) {
        key.forEach((k) => {
          const node = resolveTargetNode(this, k);
          if (node) node.reset();
        });
      } else {
        const node = resolveTargetNode(this, key);
        if (node) node.reset();
      }
    }
  }
  // setValue = (target: string | Record<string, any>, value?: any) => {
  //     // 1. Batch dictionary update
  //     if (target !== null && typeof target === 'object') {
  //         for (const [key, val] of Object.entries(target)) {
  //             this.setSingleValue(key, val)
  //         }
  //         return
  //     }
  //     // 2. Single key update
  //     if (typeof target === 'string') {
  //         this.setSingleValue(target, value)
  //     }
  // }
  // private setSingleValue(targetPath: string, newValue: any) {
  //     // Ultra-fast path for immediate siblings without slashes or dots: "city"
  //     if (!targetPath.includes('/') && !targetPath.includes('.')) {
  //         // console.log('immediate sibling', targetPath, newValue)
  //         const sibling = (this.parent as NodeWithFields)?.fields?.get(targetPath) ?? (this.parent as NodeWithFields)?.field?.(targetPath)
  //         if (!sibling) return
  //         if (sibling.isFlat) {
  //             sibling.value = newValue
  //         } else sibling.setValue(newValue)
  //     }
  //     // Traverse relative/nested path
  //     const node = resolveTargetNode(this, targetPath)
  //     if (!node) return
  //     if (node.isFlat) {
  //         node.value = newValue
  //     } else node.setValue(newValue)
  // }
  hide() {
    if (this._hidden) return;
    delete this._dataParent[this.name];
    this._hidden = true;
  }
  show() {
    if (!this._hidden) return;
    this._dataParent[this.name] = this._value;
    this._hidden = false;
  }
};

// src/store/ArrayStore.ts
var ArrayField = class extends FormNode {
  constructor(name, parent, parentData) {
    super(name, parent.root);
    this.parent = parent;
    this.parentData = parentData;
    this.parentData[name] = this.data;
  }
  parent;
  items = [];
  itemPerKey = /* @__PURE__ */ new Map();
  _inputCode = 5;
  _hidden = false;
  _disabled = false;
  isFlat = false;
  data = [];
  parentData;
  listeners = /* @__PURE__ */ new Set();
  controller = {
    length: this.length,
    add: (args) => this.addItem(args),
    remove: (index) => this.remove(index),
    clear: () => this.clear()
  };
  subscribe = (cb) => {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  };
  getIndex(key) {
    return this.items.findIndex((item) => item.name === key);
  }
  notify() {
    this.listeners.forEach((listener) => listener());
  }
  set hidden(v) {
    v ? this.hide() : this.show();
  }
  set disabled(v) {
    this._disabled = v;
  }
  // set displayCode(displayName ?: DisplayNames) {
  //     this._inputCode = 5
  // }
  hide() {
    if (this._hidden) return;
    delete this.parentData[this.name];
    this._hidden = true;
  }
  show() {
    if (!this._hidden) return;
    this.parentData[this.name] = this.data;
    this._hidden = false;
  }
  get hidden() {
    return this._hidden;
  }
  get length() {
    return this.items.length;
  }
  get displayCode() {
    return this._inputCode;
  }
  item(index) {
    return this.items[index];
  }
  /**
  * Sets values for items inside this ArrayField.
  * Can accept:
  * - Array of objects: [{ host: 'localhost', mediaId: '123' }, { host: 'cdn', mediaId: '456' }]
  * - Array of objects with explicit index: [{ index: 1, host: 'new-host' }]
  */
  setValue(itemsData) {
    if (!Array.isArray(itemsData)) return;
    for (let i = 0; i < itemsData.length; i++) {
      const rowData = itemsData[i];
      if (!rowData || typeof rowData !== "object") continue;
      const targetIndex = typeof rowData.index === "number" ? rowData.index : i;
      if (this.items.length <= targetIndex) {
        return;
      }
      const itemNode = this.items[targetIndex];
      if (itemNode) {
        itemNode.setValue(rowData);
      }
    }
  }
  // setValue(value : Record<string, any>[]) {
  //     for (let i = 0; i < value.length; i++) {
  //         const item = value[i]
  //         if (!item) continue
  //         const field = this.items[i]
  //         for (const [key, val] of Object.entries(item)) {
  //             const inputField = field.fields.get(key)
  //             if (inputField instanceof InputField) inputField.value = val
  //         }
  //     }
  // }
  reset(index) {
    if (index) {
      if (Array.isArray(index)) {
        for (const i of index) {
          this.items[i]?.reset();
        }
      } else {
        this.items[index]?.reset();
      }
      return;
    }
    for (const item of this.items) {
      item.reset();
    }
  }
  initializeArrayItem(repeat = 1, initialValue) {
    this.addItem({ count: repeat, initialValue });
  }
  addItem = (args) => {
    const initialValue = args?.initialValue;
    const count = args?.count ?? initialValue?.length ?? 1;
    const index = args?.index;
    const isMultiple = count > 1 || Array.isArray(initialValue);
    if (isMultiple) {
      this.addMultiple(count, initialValue, index);
    } else {
      this.add(initialValue, index);
    }
  };
  add(initialValue, index) {
    const item = new ArrayItem(
      this,
      initialValue,
      this.data,
      index
    );
    if (index !== void 0) {
      this.items = this.items.toSpliced(index, 0, item);
    } else {
      this.items = [...this.items, item];
    }
    this.notify();
    return item;
  }
  addMultiple(count, initialValues, index) {
    if (initialValues && initialValues[0]?.index) {
      return this.addMultipleViaIndex(count, initialValues);
    }
    const newItems = [];
    for (let i = 0; i < count; i++) {
      const initialValue = initialValues?.[i];
      const item = new ArrayItem(
        this,
        initialValue,
        this.data,
        index === void 0 ? void 0 : index + i
      );
      newItems.push(item);
    }
    if (index !== void 0) {
      this.items = this.items.toSpliced(index, 0, ...newItems);
    } else {
      this.items = [...this.items, ...newItems];
    }
    this.notify();
  }
  addMultipleViaIndex(count, initialValues) {
    for (let i = 0; i < count; i++) {
      const initialValue = initialValues[i];
      const index = initialValue?.index;
      const item = new ArrayItem(
        this,
        initialValue,
        this.data,
        index
      );
      this.items = this.items.toSpliced(index, 0, item);
    }
    this.notify();
  }
  remove(index) {
    console.log("removing item", index);
    if (index < 0 || index >= this.items.length) {
      return;
    }
    this.items = this.items.toSpliced(index, 1);
    this.data.splice(index, 1);
    this.notify();
  }
  removeItem(item) {
    const index = this.items.indexOf(item);
    if (index === -1) return;
    this.items = this.items.filter((i) => i !== item);
    this.data.splice(index, 1);
    this.notify();
  }
  pop() {
    const item = this.items.pop();
    if (item) {
      this.notify();
    }
    return item;
  }
  clear() {
    if (this.items.length === 0) return;
    this.items.length = 0;
    this.notify();
  }
};
var ArrayItem = class extends ContainerNode {
  constructor(array, initialValue = {}, arrayData, targetIndex) {
    super("", array.root);
    this.array = array;
    this.data = {};
    this.parent = array.parent;
    if (targetIndex !== void 0) {
      arrayData.splice(targetIndex, 0, this.data);
    } else {
      arrayData.push(this.data);
    }
    this.initialize(initialValue);
  }
  array;
  id = crypto.randomUUID();
  fields = /* @__PURE__ */ new Map();
  // public readonly fields =
  //     new Map<string, FormNode>()
  data;
  isFlat = false;
  parent;
  get index() {
    return this.array.items.indexOf(this);
  }
  initialize(initialValue) {
    for (const [name, value] of Object.entries(initialValue)) {
      if (Array.isArray(value)) {
        const array = this.createArray(name);
        for (const item of value) {
          array.addItem({ initialValue: item });
        }
        continue;
      }
      if (value !== null && typeof value === "object") {
        const object = this.createObject(name);
        object.initialize(value);
        continue;
      }
      this.createField(name, value);
    }
  }
  createField(name, initialValue = "") {
    const existing = this.fields.get(name);
    if (existing instanceof InputField) {
      existing.value = initialValue;
      return existing;
    }
    const field = new InputField(
      name,
      initialValue,
      this,
      this.data
    );
    this.fields.set(name, field);
    return field;
  }
  createObject(name) {
    const existing = this.fields.get(name);
    if (existing instanceof FormObject) {
      return existing;
    }
    const object = new FormObject(
      name,
      this,
      this.data
    );
    this.fields.set(name, object);
    return object;
  }
  createArray(name) {
    const existing = this.fields.get(name);
    if (existing instanceof ArrayField) {
      return existing;
    }
    const array = new ArrayField(
      name,
      this,
      this.data
    );
    this.fields.set(name, array);
    return array;
  }
  createDropdown(name, options, initialValue = "", initialLabel = "Select", includeDefaultLabel = false) {
    const existing = this.fields.get(name);
    if (existing instanceof DropdownField) {
      existing.options = options;
      return existing;
    }
    const field = new DropdownField(
      name,
      initialValue,
      options,
      this,
      this.data,
      initialLabel,
      includeDefaultLabel
    );
    this.fields.set(name, field);
    return field;
  }
  createDependentDropdown(name, options, initialValue = "", initialLabel = "Select", includeDefaultLabel = false, dependsOn) {
    const existing = this.fields.get(name);
    if (existing instanceof DropdownDependencyField) {
      existing.options = options;
      return existing;
    }
    const field = new DropdownDependencyField(
      name,
      initialValue,
      options,
      this,
      this.data,
      initialLabel,
      includeDefaultLabel,
      dependsOn
    );
    this.fields.set(name, field);
    return field;
  }
  setValue(rowData) {
    if (!rowData || typeof rowData !== "object") return;
    console.log("itemsData", rowData);
    for (const [key, val] of Object.entries(rowData)) {
      if (key === "index") continue;
      const childField = this.fields.get(key);
      if (!childField) continue;
      if (childField.isFlat) {
        childField.value = val;
      } else {
        childField.setValue(val);
      }
    }
  }
  reset() {
    for (const field of this.fields.values()) {
      field.reset();
    }
  }
  add(initialValue = {}) {
    this.array.addItem(initialValue);
  }
  remove = () => {
    if (this.array.length === 1) return;
    this.array.removeItem(this);
  };
  field(name) {
    return this.fields.get(name);
  }
};

// src/Utils/FieldUtils.ts
var createField = (placeholder, name, inputStore, initialValue, scope) => {
  const localName = name ?? camelCase(placeholder);
  if (!scope) {
    return inputStore.createField(
      localName,
      initialValue
    );
  }
  const parent = scope.node;
  if (parent instanceof ArrayItem) {
    return parent.createField(
      localName,
      initialValue
    );
  }
  if (parent instanceof FormObject) {
    return parent.createField(
      localName,
      initialValue
    );
  }
  return inputStore.createField(
    localName,
    initialValue
  );
};

// src/components/StrInput.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var StrInput = (0, import_react8.forwardRef)((props, ref) => {
  const { placeholder, name, children, style, className = "", initialValue = "", required = false, disabled = false, hideElement = false, privacy = false, ...rest } = props;
  const { inputStore } = useContainerContext();
  const scope = useNameScope();
  const field = (0, import_react8.useRef)(null);
  if (field.current === null) {
    const fieldInstance = createField(
      placeholder,
      name,
      inputStore,
      initialValue,
      scope
    );
    fieldInstance.displayCode = "StrInput";
    hideElement && inputStore.registerHidden(fieldInstance, hideElement);
    disabled && inputStore.registerDisabled(fieldInstance, disabled);
    field.current = fieldInstance;
  }
  const styleClass = (0, import_react8.useMemo)(() => {
    return getStyleClass(style);
  }, [style]);
  const disabledValue = useIsDisabled(field.current);
  const hiddenValue = useIsHidden(field.current);
  const handleChange = (0, import_react8.useCallback)((value) => {
    const fieldValue = field.current;
    if (!fieldValue) return;
    fieldValue.value = value;
  }, []);
  if (hiddenValue) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: `field-root ${styleClass} ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      InputTemplate_default,
      {
        name: field.current.name,
        placeholder,
        children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          Input_default,
          {
            ref,
            field: field.current,
            placeholder,
            disabled: disabledValue,
            type: privacy ? "password" : "text",
            handleChange,
            ...rest
          }
        )
      }
    ),
    children
  ] });
});
var MemoizedStrInput = (0, import_react8.memo)(StrInput);
MemoizedStrInput.displayName = "StrInput";
var StrInput_default = MemoizedStrInput;

// src/components/NumInput.tsx
var import_react9 = require("react");

// src/Utils/Stringify.ts
var stringValidation = (data, stringify) => {
  if (typeof data !== "number") return null;
  if (!stringify) return data;
  else return data.toString();
};

// src/components/NumInput.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var NumInput = (0, import_react9.forwardRef)((props, ref) => {
  const { placeholder, name, children, style, className = "", onDisableChange, initialValue = "", required = false, disabled = false, hideElement = false, privacy = false, stringify = false, ...rest } = props;
  const { inputStore } = useContainerContext();
  const scope = useNameScope();
  const field = (0, import_react9.useRef)(null);
  if (field.current === null) {
    const fieldInstance = createField(
      placeholder,
      name,
      inputStore,
      initialValue,
      scope
    );
    fieldInstance.displayCode = "NumInput";
    hideElement && inputStore.registerHidden(fieldInstance, hideElement);
    disabled && inputStore.registerDisabled(fieldInstance, disabled);
    field.current = fieldInstance;
  }
  const styleClass = (0, import_react9.useMemo)(() => {
    return getStyleClass(style);
  }, [style]);
  const disabledValue = useIsDisabled(field.current);
  const hiddenValue = useIsHidden(field.current);
  const handleChange = (0, import_react9.useCallback)((value) => {
    const newValue = value === "" ? "" : stringValidation(Number(value), stringify);
    if (newValue === null) return;
    const fieldValue = field.current;
    if (!fieldValue) return;
    fieldValue.value = newValue;
  }, [stringify]);
  if (hiddenValue) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `field-root ${styleClass} ${className}`, children: [
    "  ",
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      InputTemplate_default,
      {
        name: field.current.name,
        placeholder,
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          Input_default,
          {
            ref,
            field: field.current,
            placeholder,
            disabled: disabledValue,
            type: privacy ? "password" : "number",
            handleChange,
            ...rest
          }
        )
      }
    ),
    children
  ] });
});
var MemoizedNumInput = (0, import_react9.memo)(NumInput);
MemoizedNumInput.displayName = "NumInput";
var NumInput_default = MemoizedNumInput;

// src/components/ArrayContainer.tsx
var import_react12 = require("react");

// src/hooks/ArrayHooks.ts
var import_react10 = require("react");
var useArrayItems = (array) => {
  const subscribe = (0, import_react10.useCallback)((cb) => array.subscribe(cb), []);
  return (0, import_react10.useSyncExternalStore)(subscribe, () => array.items);
};

// src/providers/ItemNodeProvider.tsx
var import_react11 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var ItemNodeProvider = ({ node, children }) => {
  const value = (0, import_react11.useMemo)(() => ({ node }), [node]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(NameScopeContext, { value, children });
};
var ItemNodeProvider_default = (0, import_react11.memo)(ItemNodeProvider);

// src/components/ArrayContainer.tsx
var import_jsx_runtime7 = (
  // <ArrayContext value={contextValue}>
  require("react/jsx-runtime")
);
var ArrayContainer = ({ name, repeat = 1, children, style, append, initialValue, hidden = false, className = "" }) => {
  const { inputStore } = useContainerContext();
  const parent = useNameScope();
  const array = (0, import_react12.useMemo)(() => {
    const parentNode = parent?.node ?? inputStore;
    const field = parentNode.createArray(name);
    field.initializeArrayItem(repeat, initialValue);
    inputStore.registerHidden(field, hidden);
    return field;
  }, [
    inputStore,
    name,
    parent
  ]);
  const items = useArrayItems(array);
  const isHidden = useIsHidden(array);
  if (isHidden) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: `array-container ${className}`, style, children: [
    items.map((item) => {
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ItemNodeProvider_default, { node: item, children }, item.id);
    }),
    typeof append === "function" ? append({ add: array.addItem, itemsCount: items.length }) : append
  ] });
};
var ArrayContainer_default = (0, import_react12.memo)(ArrayContainer);

// src/components/ObjContainer.tsx
var import_react13 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
var ObjectContainer = ({
  name,
  // inputContainerStyles = '',
  children
}) => {
  const { inputStore } = useContainerContext();
  const parent = useNameScope();
  const object = (0, import_react13.useMemo)(() => {
    const parentNode = parent?.node ?? inputStore;
    const field = parentNode.createObject(name);
    inputStore.registerHidden(field, false);
    return field;
  }, [parent, name]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ItemNodeProvider_default, { node: object, children });
};
var MemoizedObjectContainer = (0, import_react13.memo)(ObjectContainer);
MemoizedObjectContainer.displayName = "ObjectContainer";
var ObjContainer_default = MemoizedObjectContainer;
{
}
{
}

// src/components/SelectInput.tsx
var import_react17 = require("react");

// src/components/DropdownModal.tsx
var import_react16 = require("react");

// src/components/DropdownLabel.tsx
var import_react14 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
var DropdownLabel = ({ field }) => {
  const label = useDropdownLabel(field);
  const toggleDropdown = (0, import_react14.useCallback)(() => {
    field.toggle();
  }, [field]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    "div",
    {
      className: `select-label field-input`,
      onClick: toggleDropdown,
      children: label
    }
  );
};
var DropdownLabel_default = (0, import_react14.memo)(DropdownLabel);

// src/components/DropdownOptions.tsx
var import_react15 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
var DropdownOptions = ({ field, searchable = false, parentRef, renderItem }) => {
  const containerRef = (0, import_react15.useRef)(null);
  const options = useGlobalOptions(field);
  const lastIndex = options.length - 1;
  const curValue = field.value;
  (0, import_react15.useEffect)(() => {
    if (!searchable && containerRef.current) {
      field.displayCode === 2 && containerRef.current.focus();
    }
  }, []);
  (0, import_react15.useEffect)(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (!document.contains(target)) return;
      const clickedInsideOptions = containerRef.current?.contains(target);
      const clickedInsideParent = field.el?.contains(target);
      if (!clickedInsideOptions && !clickedInsideParent) {
        console.log("closing dropdown with outside click");
        field.close();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [field, field]);
  const handleSearchChange = (0, import_react15.useCallback)((e) => {
    const value = e.target.value;
    GlobalOptionStore.setSearch(value);
  }, [field]);
  const stopFocusPropagation = (0, import_react15.useCallback)((e) => {
    e.stopPropagation();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    "div",
    {
      className: "select-options-container",
      onKeyDown: GlobalOptionStore.handleKeyDown,
      onFocus: stopFocusPropagation,
      tabIndex: -1,
      ref: containerRef,
      children: [
        searchable && // <div style={{ paddingBlock: '5px', paddingInline: '10px', borderBottom: '1px solid red' }}>
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "input",
          {
            id: `search_${field.name}`,
            autoFocus: true,
            onFocus: stopFocusPropagation,
            onChange: handleSearchChange,
            className: "select-search",
            placeholder: "Search..."
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { children: options.map((option, index) => {
          const optionValue = option.value;
          const optionLabel = option.label;
          const isSelected = optionValue === curValue;
          return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "div",
            {
              role: "option",
              "aria-selected": isSelected,
              ref: (el) => {
                if (!el) return;
                GlobalOptionStore.registerElement(index, el, isSelected, lastIndex === index);
              },
              onMouseEnter: () => GlobalOptionStore.highlight(index),
              className: `select-option`,
              onClick: () => GlobalOptionStore.select(index),
              children: renderItem ? renderItem(option.raw ?? optionValue, index, isSelected) : optionLabel
            },
            optionLabel
          );
        }) })
      ]
    }
  );
};
var DropdownOptions_default = (0, import_react15.memo)(DropdownOptions);

// src/components/DropdownOpen.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var DropdownOpen = ({ field, inputRef, searchable, renderItem }) => {
  const isOpen = useIsOpen(field);
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DropdownOptions_default, { field, searchable, parentRef: inputRef, renderItem });
};
var DropdownOpen_default = DropdownOpen;

// src/components/DropdownModal.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
var DropdownModal = ({
  field,
  onBlur,
  onFocus,
  searchable
}) => {
  const inputRef = (0, import_react16.useRef)(null);
  const openDropdown = (0, import_react16.useCallback)(() => {
    if (field._disabled) return;
    field.open();
  }, []);
  const closeDropdown = (0, import_react16.useCallback)(() => {
    field.close();
  }, []);
  const handleTabKey = (0, import_react16.useCallback)((e) => {
    console.log("the pressed key is", e.key);
    if (e.key === "Enter") {
      openDropdown();
      return;
    }
  }, []);
  const handleTabToOpen = (0, import_react16.useCallback)((e) => {
    if (!e.relatedTarget && document.activeElement === e.target) {
      return;
    }
    console.log("tab to open");
    onFocus?.(field.name);
    openDropdown();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
    "div",
    {
      ref: (el) => {
        if (!el) return;
        field.el = el;
        inputRef.current = el;
      },
      onMouseDown: (e) => e.preventDefault(),
      onFocus: handleTabToOpen,
      onKeyDown: handleTabKey,
      tabIndex: 0,
      className: `select-container`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DropdownLabel_default, { field }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DropdownOpen_default, { field, inputRef, searchable })
      ]
    }
  );
};
var DropdownModal_default = (0, import_react16.memo)(DropdownModal);

// src/Utils/DropdownUtils.ts
var createDropdown = (placeholder, name, options, inputStore, initialValue, initialLabel, includeDefaultLabel, scope) => {
  const localName = name ?? camelCase(placeholder);
  if (!scope) {
    return inputStore.createDropdown(
      localName,
      options,
      initialValue,
      initialLabel,
      includeDefaultLabel
    );
  }
  const parent = scope.node;
  if (parent instanceof ArrayItem) {
    return parent.createDropdown(
      localName,
      options,
      initialValue,
      initialLabel,
      includeDefaultLabel
    );
  }
  if (parent instanceof FormObject) {
    return parent.createDropdown(
      localName,
      options,
      initialValue,
      initialLabel,
      includeDefaultLabel
    );
  }
  return inputStore.createDropdown(
    localName,
    options,
    initialValue
  );
};

// src/components/SelectInput.tsx
var import_jsx_runtime13 = (
  // <div className={`field-root field-select-root ${styleClass} ${className}`} style={{'--float' : 1, '--anchor-name': `${field.current!.name}`}}>
  require("react/jsx-runtime")
);
var SelectInput = (0, import_react17.forwardRef)((props, ref) => {
  const {
    name,
    placeholder,
    options,
    children,
    onChange,
    onToggleDropdown,
    includeDefaultLabel = false,
    initialLabel = "Select",
    disabled = false,
    hideElement = false,
    searchable = false,
    initialValue = "",
    style,
    className = "",
    ...rest
  } = props;
  const { inputStore } = useContainerContext();
  const scope = useNameScope();
  const anchorName = (0, import_react17.useRef)(
    `--field-anchor-${crypto.randomUUID()}`
  ).current;
  const field = (0, import_react17.useRef)(null);
  if (field.current === null) {
    const fieldInstance = createDropdown(
      placeholder,
      name,
      options,
      inputStore,
      initialValue,
      initialLabel,
      includeDefaultLabel,
      scope
    );
    hideElement && inputStore.registerHidden(fieldInstance, hideElement);
    disabled && inputStore.registerDisabled(fieldInstance, disabled);
    fieldInstance.subscribe(() => {
      onChange?.({
        value: fieldInstance.value,
        setFields: (fields) => fieldInstance.setFields(fields),
        arrayAction: (path) => fieldInstance.getArray(path),
        reset: (target) => fieldInstance.reset(target)
      });
    });
    fieldInstance.subscribeToggle(() => {
      onToggleDropdown?.(fieldInstance.isOpen);
    });
    field.current = fieldInstance;
  }
  const styleClass = (0, import_react17.useMemo)(() => {
    return getStyleClass(style);
  }, [style]);
  (0, import_react17.useImperativeHandle)(
    ref,
    () => ({
      open: () => setTimeout(() => {
        field.current?.open();
      }, 0),
      close: () => setTimeout(() => {
        field.current?.close();
      }, 0)
    }),
    []
  );
  const hiddenValue = useIsHidden(field.current);
  if (hiddenValue) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: `field-root field-select-root ${styleClass} ${className}`, style: { "--float": 1, "--anchor-name": `${anchorName}` }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      InputTemplate_default,
      {
        name: field.current.name,
        placeholder,
        children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          DropdownModal_default,
          {
            searchable,
            field: field.current,
            ...rest
          }
        )
      }
    ),
    children
  ] });
});
var MemoizedSelectInput = (0, import_react17.memo)(SelectInput);
MemoizedSelectInput.displayName = "SelectInput";
var SelectInput_default = MemoizedSelectInput;

// src/components/AutoInput.tsx
var import_react18 = require("react");
var import_jsx_runtime14 = require("react/jsx-runtime");
var AutoInput = ({ initialData, exclusionKeys }) => {
  const renderField = (key, value, scope) => {
    const modifiedKey = scope ? `${scope}.${key}` : key;
    const commonProps = {
      initialValue: value,
      name: key,
      placeholder: fromCamelCase(key)
    };
    if (typeof value === "string") {
      return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(StrInput_default, { ...commonProps }, modifiedKey);
    }
    if (typeof value === "number") {
      return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(NumInput_default, { ...commonProps }, modifiedKey);
    }
    if (Array.isArray(value)) {
      return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        ArrayContainer_default,
        {
          name: key,
          children: value.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(AutoInput, { initialData: item }, index))
        },
        key
      );
    }
    if (isPlainObject(value)) {
      return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(ObjContainer_default, { name: key, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(AutoInput, { initialData: value }) }, modifiedKey);
    }
    return null;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_jsx_runtime14.Fragment, { children: Object.entries(initialData || {}).map(([key, value]) => {
    if (exclusionKeys?.includes(key)) return null;
    return renderField(key, value);
  }) });
};
var MemoizedAutoInput = (0, import_react18.memo)(AutoInput);
MemoizedAutoInput.displayName = "AutoInput";
var AutoInput_default = MemoizedAutoInput;

// src/components/DateInput.tsx
var import_react19 = require("react");
var import_jsx_runtime15 = require("react/jsx-runtime");
var DateInput = (0, import_react19.forwardRef)((props, ref) => {
  const { defaultTodayDate, defaultDate, name, placeholder, hideElement, disabled, style, className, privacy, children, seperator = "/", onFocus, ...rest } = props;
  const { inputStore } = useContainerContext();
  const todayDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const initialDate = defaultTodayDate ? todayDate : defaultDate ?? "";
  const scope = useNameScope();
  const field = (0, import_react19.useRef)(null);
  if (field.current === null) {
    const fieldInstance = createField(
      placeholder,
      name,
      inputStore,
      initialDate,
      scope
    );
    fieldInstance.displayCode = "DateInput";
    hideElement && inputStore.registerHidden(fieldInstance, hideElement);
    disabled && inputStore.registerDisabled(fieldInstance, disabled);
    field.current = fieldInstance;
  }
  const handleDateSelect = (0, import_react19.useCallback)((value) => {
    console.log("handleDateSelect", value);
    field.current.value = value;
  }, []);
  const styleClass = (0, import_react19.useMemo)(() => {
    return getStyleClass(style);
  }, [style]);
  const handleFocus = (0, import_react19.useCallback)((key, inputRef) => {
    inputRef.current?.showPicker();
    onFocus?.(key);
  }, [onFocus]);
  const disabledValue = useIsDisabled(field.current);
  const hiddenValue = useIsHidden(field.current);
  if (hiddenValue) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: `field-root ${styleClass} ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      InputTemplate_default,
      {
        name: field.current.name,
        placeholder,
        children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          Input_default,
          {
            ref,
            field: field.current,
            placeholder,
            disabled: disabledValue,
            type: "date",
            handleChange: handleDateSelect,
            onFocus: handleFocus,
            ...rest
          }
        )
      }
    ),
    children
  ] });
});
var memoizedDateInput = (0, import_react19.memo)(DateInput);
memoizedDateInput.displayName = "DateInput";
var DateInput_default = memoizedDateInput;
{
}
{
}

// src/components/DisabledInput.tsx
var import_react20 = require("react");
var import_jsx_runtime16 = require("react/jsx-runtime");
var DisabledInput = ({
  initialValue = "",
  privacy = false,
  children,
  style,
  className = "",
  placeholder,
  hideElement = false,
  name,
  ...rest
}) => {
  const { inputStore } = useContainerContext();
  const scope = useNameScope();
  const field = (0, import_react20.useRef)(null);
  if (field.current === null) {
    const fieldInstance = createField(
      placeholder,
      name,
      inputStore,
      initialValue,
      scope
    );
    fieldInstance.displayCode = "DisabledInput";
    hideElement && inputStore.registerHidden(fieldInstance, hideElement);
    field.current = fieldInstance;
  }
  const styleClass = (0, import_react20.useMemo)(() => {
    return getStyleClass(style);
  }, [style]);
  const hiddenValue = useIsHidden(field.current);
  if (hiddenValue) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: `field-root ${styleClass} ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      InputTemplate_default,
      {
        name: field.current.name,
        placeholder,
        children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          Input_default,
          {
            field: field.current,
            placeholder,
            disabled: true,
            type: privacy ? "password" : "text",
            fixedValue: initialValue,
            ...rest
          }
        )
      }
    ),
    children
  ] });
};
var MemoizedDisabledInput = (0, import_react20.memo)(DisabledInput);
MemoizedDisabledInput.displayName = "DisabledInput";
var DisabledInput_default = MemoizedDisabledInput;
{
}

// src/components/RunningText.tsx
var import_react21 = require("react");
var import_jsx_runtime17 = require("react/jsx-runtime");
var RunningText = ({
  children,
  width,
  className = "",
  speed,
  maxAutoSpeed = 20
}) => {
  const containerRef = (0, import_react21.useRef)(null);
  const contentRef = (0, import_react21.useRef)(null);
  (0, import_react21.useLayoutEffect)(() => {
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
    function measure() {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;
      const scrollW = Math.ceil(content.scrollWidth);
      const visibleW = Math.ceil(container.clientWidth);
      const overflow = scrollW > visibleW;
      container.classList.toggle("rt-overflow", overflow);
      if (!overflow) return;
      const gap = 48;
      const distance = scrollW + gap;
      container.style.setProperty("--rt-distance", `-${distance}px`);
      if (speed) {
        container.style.setProperty("--rt-speed", `${speed}s`);
      } else {
        const pxPerSecond = 60;
        const duration = scrollW / pxPerSecond;
        container.style.setProperty(
          "--rt-speed",
          `${Math.min(duration, maxAutoSpeed)}s`
        );
      }
    }
  }, [children, speed, maxAutoSpeed]);
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    "div",
    {
      ref: containerRef,
      style: { width },
      className: `rt-container ${className}`,
      children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "rt-track", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { ref: contentRef, className: "rt-content", children }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "rt-content rt-duplicate", "aria-hidden": true, children })
      ] })
    }
  );
};
var RunningText_default = (0, import_react21.memo)(RunningText);

// src/components/FormRow.tsx
var import_react22 = require("react");
var import_jsx_runtime18 = require("react/jsx-runtime");
var FormRow = ({
  label,
  separator,
  children,
  className = "",
  labelWidth = "12rem"
  // default alignment width
}) => {
  const value = (0, import_react22.useMemo)(() => ({ labelMode: true }), []);
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(FormLayoutContext.Provider, { value, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
    "div",
    {
      className: `
          grid items-center gap-x-3
          ${className}
        `,
      style: {
        gridTemplateColumns: `${labelWidth} auto 1fr`
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "whitespace-nowrap", children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "whitespace-nowrap text-center", children: separator ?? null }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { children })
      ]
    }
  ) });
};
var FormRow_default = (0, import_react22.memo)(FormRow);

// src/components/SearchInput.tsx
var import_react23 = require("react");
var import_jsx_runtime19 = require("react/jsx-runtime");
var SearchInput = (0, import_react23.forwardRef)(({ ...props }, ref) => {
  const { placeholder, name, children, onChange, style, className = "", renderItem, onSelect, initialValue = "", disabled = false, hideElement = false, privacy = false, ...rest } = props;
  const { inputStore } = useContainerContext();
  const scope = useNameScope();
  const searchRef = (0, import_react23.useRef)(null);
  const anchorName = (0, import_react23.useRef)(
    `--field-anchor-${crypto.randomUUID()}`
  ).current;
  const timeOutObj = (0, import_react23.useRef)(null);
  const field = (0, import_react23.useRef)(null);
  const dropdownField = (0, import_react23.useRef)(null);
  if (field.current === null) {
    const fieldInstance = createField(
      placeholder,
      name,
      inputStore,
      initialValue,
      scope
    );
    fieldInstance.displayCode = "StrInput";
    hideElement && inputStore.registerHidden(fieldInstance, hideElement);
    disabled && inputStore.registerDisabled(fieldInstance, disabled);
    const dropdownFieldInstance = new DropdownField("search-internal", "", [], null, null, "");
    dropdownFieldInstance.displayCode = "SearchInput";
    dropdownFieldInstance.subscribe(() => {
      fieldInstance.value = dropdownFieldInstance.value;
      onSelect?.(dropdownFieldInstance.value);
    });
    field.current = fieldInstance;
    dropdownField.current = dropdownFieldInstance;
  }
  const styleClass = (0, import_react23.useMemo)(() => {
    return getStyleClass(style);
  }, [style]);
  const disabledValue = useIsDisabled(field.current);
  const hiddenValue = useIsHidden(field.current);
  const handleChange = (value) => {
    clearTimeout(timeOutObj.current);
    timeOutObj.current = setTimeout(async () => {
      if (!value) return;
      const searchedData = await onChange(value);
      console.log("the searched data is", searchedData);
      const dropdownInstance = dropdownField.current;
      if (!dropdownInstance) return;
      dropdownInstance.options = searchedData;
      dropdownInstance.open();
    }, 800);
    const fieldValue = field.current;
    if (!fieldValue) return;
    fieldValue.value = value;
  };
  if (hiddenValue) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
    "div",
    {
      className: `field-root select-container ${styleClass} ${className}`,
      ref: (el) => {
        if (el) {
          dropdownField.current.el = el;
        }
      },
      onKeyDown: GlobalOptionStore.handleKeyDown,
      style: { "--anchor-name": `${anchorName}` },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
          InputTemplate_default,
          {
            name: field.current.name,
            placeholder,
            children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
              Input_default,
              {
                ref,
                field: field.current,
                refRequired: true,
                placeholder,
                disabled: disabledValue,
                type: "text",
                handleChange,
                ...rest
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(DropdownOpen_default, { field: dropdownField.current, inputRef: searchRef, searchable: false, renderItem }),
        children
      ]
    }
  );
});
var SearchInput_default = (0, import_react23.memo)(SearchInput);

// src/components/SubmitButton.tsx
var import_react24 = __toESM(require("react"));
var import_jsx_runtime20 = require("react/jsx-runtime");
var SubmitButton = (0, import_react24.forwardRef)(({
  children,
  className,
  closeModal,
  disabled = false,
  onClick,
  modal
}, ref) => {
  const { isDisabled = false, modalStyle, onConfirm, renderConfirmationModel } = modal || {};
  const { inputStore } = useContainerContext();
  const [openModal, setOpenModal] = (0, import_react24.useState)(false);
  const formHelpers = (0, import_react24.useMemo)(() => ({
    reset: (key) => inputStore.reset(key),
    clear: () => inputStore.clear(),
    get edited() {
      return inputStore.getEditedData();
    }
  }), [inputStore]);
  const success = (data) => {
    onConfirm?.(data);
    setOpenModal(false);
    closeModal?.();
  };
  const cancel = () => {
    setOpenModal(false);
  };
  const handleSubmit = (0, import_react24.useCallback)(async (e) => {
    if (disabled || openModal) return;
    if (!onClick && renderConfirmationModel) {
      setOpenModal(true);
      return;
    }
    if (onClick) {
      const shouldOpenModal = await Promise.resolve(
        onClick({ data: inputStore.data, ...formHelpers, stopPropagation: () => e.stopPropagation(), preventDefault: () => e.preventDefault() })
      );
      if (shouldOpenModal && renderConfirmationModel) {
        setOpenModal(true);
      }
    }
  }, [onClick, disabled, openModal, renderConfirmationModel, inputStore, formHelpers]);
  (0, import_react24.useImperativeHandle)(ref, () => ({
    submit: handleSubmit
  }), [handleSubmit]);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: `${className}`, onClick: handleSubmit, children: [
    children,
    openModal ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "div",
      {
        className: `fixed flex cursor-default justify-center items-center z-50 left-0 top-0 w-full h-full bg-gray-500/50 backdrop-blur-lg `,
        children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
          "div",
          {
            className: `relative grid rounded-lg shadow-lg bg-gray-400 overflow-y-auto max-h-4/5`,
            style: { height: modalStyle?.height, width: modalStyle?.width || "80%" },
            children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "", children: typeof renderConfirmationModel === "function" ? renderConfirmationModel({ cancel, success, data: inputStore.data, isDisabled, ...formHelpers }) : import_react24.default.isValidElement(renderConfirmationModel) ? import_react24.default.cloneElement(renderConfirmationModel, { cancel, success, data: inputStore.data, isDisabled, ...formHelpers }) : null })
          }
        )
      }
    ) : null
  ] });
});
var MemoizedSubmitButton = (0, import_react24.memo)(SubmitButton);
MemoizedSubmitButton.displayName = "SubmitButton";
var SubmitButton_default = MemoizedSubmitButton;

// src/components/InputContainer.tsx
var import_react25 = require("react");
var import_react26 = require("react");

// src/store/InputStoreRegistry.ts
var formRegistry = /* @__PURE__ */ new Map();
var getOrCreateFormStore = (formId) => {
  let store = formRegistry.get(formId);
  if (!store) {
    store = new InputForm(formId);
    formRegistry.set(formId, store);
  }
  return store;
};

// src/functions/stringManiputation.ts
var randomString = (maxLength = 5) => Math.random().toString(36).slice(2, maxLength + 2);

// src/components/InputContainer.tsx
var import_jsx_runtime21 = require("react/jsx-runtime");
var InputContainer = ({ children, className, style, formId, fieldStyle, mode = "default", initialData = {} }) => {
  const randomId = randomString();
  const id = formId || randomId;
  const storeRef = (0, import_react25.useRef)(null);
  if (storeRef.current === null) {
    const store = getOrCreateFormStore(id);
    store.initializeForm(mode, initialData);
    storeRef.current = store;
  }
  const containerRef = (0, import_react25.useRef)(null);
  const styleClass = (0, import_react25.useMemo)(() => {
    return getStyleClass(fieldStyle);
  }, [fieldStyle]);
  const contextValue = (0, import_react25.useMemo)(() => ({
    // modalContainerRef,
    inputStore: storeRef.current
  }), []);
  (0, import_react25.useLayoutEffect)(() => {
    const mainContainerEl = containerRef.current;
    if (!(mainContainerEl instanceof HTMLElement)) return;
    const updateVisualBackground = () => {
      let current = mainContainerEl;
      let backgroundColor = "";
      while (current) {
        const style2 = window.getComputedStyle(current);
        backgroundColor = style2.backgroundColor;
        if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)" && backgroundColor !== "transparent") {
          break;
        }
        current = current.parentElement;
      }
      if (backgroundColor === "rgba(0, 0, 0, 0)" || backgroundColor === "") {
        mainContainerEl.style.setProperty("--line-bg", "white");
      } else {
        mainContainerEl.style.setProperty("--line-bg", backgroundColor);
      }
    };
    updateVisualBackground();
    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        updateVisualBackground();
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"]
      // Catches class changes or attribute updates
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  (0, import_react25.useEffect)(() => {
    return () => {
      storeRef.current?.clear();
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(ContainerContext.Provider, { value: contextValue, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    "div",
    {
      "data-input-container": true,
      ref: containerRef,
      style,
      className: `input-container ${styleClass} ${className}`,
      children
    }
  ) });
};
var InputContainer_default = (0, import_react26.memo)(InputContainer);

// src/store/sharedMemory.ts
var SharedMemory = class {
  storage = /* @__PURE__ */ new Map();
  get(key) {
    return key ? this.storage.get(key) : Object.fromEntries(this.storage);
  }
  set(key, value) {
    this.storage.set(key, value);
  }
  addMany(data) {
    Object.entries(data).forEach(
      ([k, v]) => this.storage.set(k, v)
    );
  }
  remove(key) {
    this.storage.delete(key);
  }
  clear() {
    this.storage.clear();
  }
};
var sharedMemory = new SharedMemory();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ArrayContainer,
  AutoInput,
  DateInput,
  DisabledInput,
  FormRow,
  InputContainer,
  NumInput,
  ObjectContainer,
  RunningText,
  SearchInput,
  SelectInput,
  StrInput,
  SubmitButton,
  sharedMemory,
  stateStyle
});
//# sourceMappingURL=index.js.map