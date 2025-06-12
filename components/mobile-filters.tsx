"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import FilterSidebar from "./filter-sidebar"

export default function MobileFilters({
  onChange,
}: {
  onChange: (filters: { [key: string]: string[] }) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6 overflow-y-auto h-[calc(100vh-5rem)]">
          <FilterSidebar onChange={onChange} />
        </div>
      </SheetContent>
    </Sheet>
  )
}