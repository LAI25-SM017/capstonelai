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
        <Button variant="outline" className="w-full bg-indigo-100 hover:bg-indigo-300 flex items-center justify-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full text-indigo-200 sm:max-w-md bg-[#1D2045]">
        <SheetHeader>
          <SheetTitle className="text-white/0">Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6 overflow-y-auto h-[calc(100vh-5rem)]">
          <FilterSidebar onChange={onChange} />
        </div>
      </SheetContent>
    </Sheet>
  )
}