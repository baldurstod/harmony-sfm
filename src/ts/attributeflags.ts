export const FATTRIB_TYPEMASK = 0x1F;

export const FATTRIB_READONLY = (1 << 5); // Don't allow editing value in editors
export const FATTRIB_DONTSAVE = (1 << 6); // Don't persist to .dmx file
export const FATTRIB_DIRTY = (1 << 7); // Indicates the attribute has been changed since the resolve phase
export const FATTRIB_HAS_CALLBACK = (1 << 8); // Indicates that this will notify its owner and/or other elements when it changes
export const FATTRIB_EXTERNAL = (1 << 9); // Indicates this attribute's data is externally owned (in a CDmElement somewhere)
export const FATTRIB_TOPOLOGICAL = (1 << 10); // Indicates this attribute effects the scene's topology (ie it's an attribute name or element)
export const FATTRIB_MUSTCOPY = (1 << 11); // parent element must make a new copy during CopyInto; even for shallow copy
export const FATTRIB_NEVERCOPY = (1 << 12); // parent element shouldn't make a new copy during CopyInto; even for deep copy
export const FATTRIB_STANDARD = (1 << 13); // This flag is set if it's a 'standard' attribute; namely 'name'
export const FATTRIB_USERDEFINED = (1 << 14); // This flag is used to sort attributes in the element properties view. User defined flags come last.
export const FATTRIB_NODUPLICATES = (1 << 15);// For element array types; disallows duplicate values from being inserted into the array.
export const FATTRIB_HAS_ARRAY_CALLBACK = (1 << 16); // Indicates that this will notify its owner and/or other elements array elements changes. Note that when elements shift (say; inserting at head; or fast remove); callbacks are not executed for these elements.
export const FATTRIB_HAS_PRE_CALLBACK = (1 << 17); // Indicates that this will notify its owner and/or other elements right before it changes
export const FATTRIB_OPERATOR_DIRTY = (1 << 18);// Used and cleared only by operator phase of datamodel
