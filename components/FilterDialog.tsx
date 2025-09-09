import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Filter } from "lucide-react"

interface Branch {
  id: number
  name: string
}

interface FilterState {
  branchId: string
  status: string
  payDateStart: string
  payDateEnd: string
}

interface FilterDialogProps {
  branches: Branch[]
  filter: FilterState
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>
}

export default function FilterDialog({ branches, filter, setFilter }: FilterDialogProps) {
  const [open, setOpen] = React.useState(false)

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    toast.success("Filters applied")
  }

  const handleClearFilter = () => {
    setFilter({ branchId: "", status: "", payDateStart: "", payDateEnd: "" })
    setOpen(false)
    toast.success("Filters cleared")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Employees</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleApplyFilter} className="space-y-4">
          <div className="space-y-2">
            <Label>Branch</Label>
            <Select value={filter.branchId} onValueChange={value => setFilter(f => ({ ...f, branchId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filter.status} onValueChange={value => setFilter(f => ({ ...f, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Processed">Processed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Pay Date Start</Label>
            <Input
              type="date"
              value={filter.payDateStart}
              onChange={e => setFilter(f => ({ ...f, payDateStart: e.target.value }))}
              max="2025-01-31"
            />
          </div>
          <div className="space-y-2">
            <Label>Pay Date End</Label>
            <Input
              type="date"
              value={filter.payDateEnd}
              onChange={e => setFilter(f => ({ ...f, payDateEnd: e.target.value }))}
              max="2025-01-31"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClearFilter}>
              Clear
            </Button>
            <Button type="submit">Apply</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}