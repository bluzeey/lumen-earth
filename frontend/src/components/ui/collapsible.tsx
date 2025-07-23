import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { AnimatePresence, motion } from "framer-motion"

const CollapsibleContext = React.createContext<{ open: boolean }>({ open: false })

function Collapsible({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const [openState, setOpenState] = React.useState(defaultOpen ?? false)
  const open = openProp !== undefined ? openProp : openState

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      onOpenChange?.(value)
      if (openProp === undefined) setOpenState(value)
    },
    [onOpenChange, openProp]
  )

  return (
    <CollapsibleContext.Provider value={{ open }}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        open={open}
        onOpenChange={handleOpenChange}
        defaultOpen={defaultOpen}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.Root>
    </CollapsibleContext.Provider>
  )
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  const { open } = React.useContext(CollapsibleContext)

  return (
    <AnimatePresence initial={false}>
      {open && (
        <CollapsiblePrimitive.CollapsibleContent asChild forceMount {...props}>
          <motion.div
            data-slot="collapsible-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        </CollapsiblePrimitive.CollapsibleContent>
      )}
    </AnimatePresence>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
