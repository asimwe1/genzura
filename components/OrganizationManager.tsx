"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Building2, Calendar, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useOrganizations, 
  useCreateOrganization, 
  useUpdateOrganization, 
  useDeleteOrganization
} from '@/hooks/useApi';
import {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest
} from '@/lib/api';

export default function OrganizationManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    name: '',
    tier: 'Basic',
    subscription_start: '',
    subscription_end: ''
  });

  // API hooks
  const { data: organizations, loading, error, execute: fetchOrganizations } = useOrganizations();
  const createOrg = useCreateOrganization();
  const updateOrg = useUpdateOrganization();
  const deleteOrg = useDeleteOrganization();

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      tier: 'Basic',
      subscription_start: '',
      subscription_end: ''
    });
  };

  // Handle create organization
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.subscription_start || !formData.subscription_end) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await createOrg.execute(formData);
      
      if (response?.status === 'success') {
        toast.success('Organization created successfully!');
        setIsCreateDialogOpen(false);
        resetForm();
        fetchOrganizations(); // Refresh the list
      } else {
        toast.error(response?.error || 'Failed to create organization');
      }
    } catch (error) {
      toast.error('An error occurred while creating the organization');
    }
  };

  // Handle edit organization
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrganization) return;

    try {
      const response = await updateOrg.execute(selectedOrganization.id, formData);
      
      if (response?.status === 'success') {
        toast.success('Organization updated successfully!');
        setIsEditDialogOpen(false);
        setSelectedOrganization(null);
        resetForm();
        fetchOrganizations(); // Refresh the list
      } else {
        toast.error(response?.error || 'Failed to update organization');
      }
    } catch (error) {
      toast.error('An error occurred while updating the organization');
    }
  };

  // Handle delete organization
  const handleDelete = async (orgId: number) => {
    if (!confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await deleteOrg.execute(orgId);
      
      if (response?.status === 'success') {
        toast.success('Organization deleted successfully!');
        fetchOrganizations(); // Refresh the list
      } else {
        toast.error(response?.error || 'Failed to delete organization');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the organization');
    }
  };

  // Open edit dialog
  const openEditDialog = (org: Organization) => {
    setSelectedOrganization(org);
    setFormData({
      name: org.name,
      tier: org.tier,
      subscription_start: org.subscription_start.split('T')[0], // Convert to date format
      subscription_end: org.subscription_end.split('T')[0]
    });
    setIsEditDialogOpen(true);
  };

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Error loading organizations: {error}</p>
        <Button onClick={() => fetchOrganizations()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-600 mt-2">Manage all organizations on the platform</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Organization Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter organization name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tier">Subscription Tier *</Label>
                <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start">Subscription Start *</Label>
                  <Input
                    id="start"
                    type="date"
                    value={formData.subscription_start}
                    onChange={(e) => setFormData({ ...formData, subscription_start: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end">Subscription End *</Label>
                  <Input
                    id="end"
                    type="date"
                    value={formData.subscription_end}
                    onChange={(e) => setFormData({ ...formData, subscription_end: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createOrg.loading}>
                  {createOrg.loading ? 'Creating...' : 'Create Organization'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Organizations List */}
      <div className="grid gap-6">
        {organizations?.map((org) => (
          <Card key={org.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{org.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTierColor(org.tier)}>
                        {org.tier === 'Enterprise' && <Crown className="h-3 w-3 mr-1" />}
                        {org.tier}
                      </Badge>
                      <span className="text-sm text-gray-500">ID: {org.id}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(org)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(org.id)}
                    disabled={deleteOrg.loading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Start: {formatDate(org.subscription_start)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">End: {formatDate(org.subscription_end)}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Created: {formatDate(org.created_at)} | Updated: {formatDate(org.updated_at)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Organization Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter organization name"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-tier">Subscription Tier *</Label>
              <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-start">Subscription Start *</Label>
                <Input
                  id="edit-start"
                  type="date"
                  value={formData.subscription_start}
                  onChange={(e) => setFormData({ ...formData, subscription_start: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-end">Subscription End *</Label>
                <Input
                  id="edit-end"
                  type="date"
                  value={formData.subscription_end}
                  onChange={(e) => setFormData({ ...formData, subscription_end: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateOrg.loading}>
                {updateOrg.loading ? 'Updating...' : 'Update Organization'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {organizations && organizations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first organization.</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </Button>
        </div>
      )}
    </div>
  );
}
