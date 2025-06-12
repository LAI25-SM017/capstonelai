'use client';

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Define filter options
const SUBJECT_OPTIONS = [
  { id: '1', name: 'Business Finance' },
  { id: '2', name: 'Graphic Design' },
  { id: '3', name: 'Web Development' },
  { id: '4', name: 'Musical Instruments' },
];

const LEVEL_OPTIONS = [
  { id: '1', name: 'Beginner Level' },
  { id: '2', name: 'Intermediate Level' },
  { id: '3', name: 'Expert Level' },
  { id: '4', name: 'All Levels' },
];

export default function FilterSidebar({
  onChange,
}: {
  onChange: (filters: { [key: string]: string[] }) => void;
}) {
  // State to store selected filters
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    subject: [],
    level: [],
    is_paid: [],
  });

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value) // Remove if already selected
        : [...currentValues, value]; // Add if not selected

      const updatedFilters = { ...prev, [filterType]: newValues };

      // Return the updated filters for local state
      return updatedFilters;
    });

    // Notify the parent component after the state update
    setTimeout(() => {
      onChange({
        ...selectedFilters,
        [filterType]: selectedFilters[filterType]?.includes(value)
          ? selectedFilters[filterType].filter((v) => v !== value)
          : [...(selectedFilters[filterType] || []), value],
      });
    }, 0);
  };

  // Reset all filters
  const handleReset = () => {
    const resetFilters = { subject: [], level: [], is_paid: [] };
    setSelectedFilters(resetFilters);
    onChange(resetFilters); // Notify parent about reset
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-900">Filters</h3>
        <button onClick={handleReset} className="text-sm text-teal-600 hover:underline">
          Reset
        </button>
      </div>

      <Accordion type="multiple" defaultValue={["category", "level", "price"]}>
        {/* Subject Filter */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-base font-medium">Subject</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {SUBJECT_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${option.id}`}
                    checked={selectedFilters.subject.includes(option.id)}
                    onCheckedChange={() => handleFilterChange('subject', option.id)}
                  />
                  <label htmlFor={`subject-${option.id}`} className="text-sm font-medium leading-none cursor-pointer">
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Level Filter */}
        <AccordionItem value="level">
          <AccordionTrigger className="text-base font-medium">Difficulty Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {LEVEL_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${option.id}`}
                    checked={selectedFilters.level.includes(option.id)}
                    onCheckedChange={() => handleFilterChange('level', option.id)}
                  />
                  <label htmlFor={`level-${option.id}`} className="text-sm font-medium leading-none cursor-pointer">
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium">Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="price-free"
                  checked={selectedFilters.is_paid.includes('0')}
                  onCheckedChange={() => handleFilterChange('is_paid', '0')}
                />
                <label htmlFor="price-free" className="text-sm font-medium leading-none cursor-pointer">
                  Free
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="price-paid"
                  checked={selectedFilters.is_paid.includes('1')}
                  onCheckedChange={() => handleFilterChange('is_paid', '1')}
                />
                <label htmlFor="price-paid" className="text-sm font-medium leading-none cursor-pointer">
                  Paid
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}