"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Package, Edit, Trash2, Plus, User } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"

export default function ServicesPage() {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([
    { id: "SVC001", name: "Consulting", category: "Business", price: 1200, provider: "Acme Corp", status: "Active" },
    { id: "SVC002", name: "Web Design", category: "IT", price: 800, provider: "Webify", status: "Active" },
    { id: "SVC003", name: "Legal Advice", category: "Legal", price: 500, provider: "LawPro", status: "Inactive" },
  ]);
  const [form, setForm] = useState({ name: "", category: "", price: "", provider: "", status: "Active" });
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddService = () => {
    setForm({ name: "", category: "", price: "", provider: "", status: "Active" });
    setFormOpen(true);
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setServices([
        ...services,
        {
          id: `SVC${services.length + 1}`.padStart(6, "0"),
          ...form,
          price: Number(form.price),
        },
      ]);
      setSaving(false);
      setFormOpen(false);
    }, 1200);
  };

  return (
    <TooltipProvider>
      <ErrorBoundary>
        <div className="flex-1 space-y-6 pr-4 md:pr-8 lg:pr-12 xl:pr-16 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Services Management</h1>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddService} aria-label="Add new service" tabIndex={0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add new service</TooltipContent>
            </Tooltip>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Services Directory</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg">
                  <Table className="min-w-[700px]">
                    <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                      <TableRow>
                        <TableHead scope="col">Service ID</TableHead>
                        <TableHead scope="col">Name</TableHead>
                        <TableHead scope="col">Category</TableHead>
                        <TableHead scope="col">Provider</TableHead>
                        <TableHead scope="col">Price</TableHead>
                        <TableHead scope="col">Status</TableHead>
                        <TableHead scope="col">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((svc) => (
                        <TableRow key={svc.id}>
                          <TableCell>{svc.id}</TableCell>
                          <TableCell>{svc.name}</TableCell>
                          <TableCell>{svc.category}</TableCell>
                          <TableCell>{svc.provider}</TableCell>
                          <TableCell>${svc.price}</TableCell>
                          <TableCell>{svc.status}</TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Edit service" tabIndex={0}><Edit className="h-4 w-4" /></Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit service</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Delete service" tabIndex={0}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete service</TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          {formOpen && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" role="dialog" aria-modal="true">
              <form onSubmit={handleSave} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-lg">Add Service</span>
                </div>
                <Input name="name" value={form.name} onChange={handleInput} placeholder="Service Name" required autoFocus aria-label="Service Name" />
                <Input name="category" value={form.category} onChange={handleInput} placeholder="Category" required aria-label="Category" />
                <Input name="provider" value={form.provider} onChange={handleInput} placeholder="Provider" required aria-label="Provider" />
                <Input name="price" value={form.price} onChange={handleInput} placeholder="Price" type="number" min="0" required aria-label="Price" />
                <select name="status" value={form.status} onChange={handleInput} className="w-full border rounded px-3 py-2" aria-label="Status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setFormOpen(false)} aria-label="Cancel add service">Cancel</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving} aria-label="Save service">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </TooltipProvider>
  );
} 