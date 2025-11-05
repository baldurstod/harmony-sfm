import { UtlBuffer } from './utlbuffer';

export class UniqueId {
	value?: string;

	createUniqueId(): void {
		this.value = generateUUID()
	}

	Serialize(buf: UtlBuffer): boolean {
		if (buf.isText()) {
			if (this.value != undefined) {
				buf.putString(this.value);
			} else {
				buf.putChar('\0');
			}
		} else {
			//buf.Put( &src, sizeof(UniqueId_t) );
			//TODO
		}
		return buf.isValid();
	}
}

function generateUUID(): string {
	let d = Date.now();
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}
