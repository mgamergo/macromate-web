"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"

export interface ModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title?: React.ReactNode
	text: React.ReactNode
	primaryButtonText?: string
	primaryVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
	onPrimary: () => void
}

/**
 * Generic Modal
 * - `open` and `onOpenChange` are controlled externally so any parent can manage state.
 * - `text` is the content to display.
 * - `primaryVariant` and `primaryButtonText` customize the primary button.
 * - `onPrimary` is called when primary button is clicked (modal remains open/closed according to parent).
 *
 * Usage (controlled from parent):
 * const [open, setOpen] = useState(false)
 * <Modal
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Delete meal"
 *   text="Are you sure you want to delete this meal? This action cannot be undone."
 *   primaryButtonText="Delete"
 *   primaryVariant="destructive"
 *   onPrimary={() => { ( perform delete then close ) setOpen(false) }}
 * />
 */
export function Modal({
	open,
	onOpenChange,
	title,
	text,
	primaryButtonText = "Confirm",
	primaryVariant = "default",
	onPrimary,
}: ModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					{title ? <DialogTitle>{title}</DialogTitle> : null}
				</DialogHeader>
				<div className="pt-2 pb-4 text-sm text-muted-foreground">{text}</div>
				<DialogFooter className="flex gap-2 justify-end">
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button variant={primaryVariant} onClick={onPrimary}>
						{primaryButtonText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default Modal
