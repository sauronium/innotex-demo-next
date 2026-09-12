export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      approval_actions: {
        Row: {
          actor_id: string
          comments: string | null
          created_at: string
          decision: Database["public"]["Enums"]["approval_decision"]
          id: string
          request_id: string
          step_number: number
        }
        Insert: {
          actor_id: string
          comments?: string | null
          created_at?: string
          decision: Database["public"]["Enums"]["approval_decision"]
          id?: string
          request_id: string
          step_number: number
        }
        Update: {
          actor_id?: string
          comments?: string | null
          created_at?: string
          decision?: Database["public"]["Enums"]["approval_decision"]
          id?: string
          request_id?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "approval_actions_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_actions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_policies: {
        Row: {
          created_at: string
          document_type: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          threshold_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_type: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          threshold_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_type?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          threshold_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          amount: number | null
          created_at: string
          current_step: number
          document_id: string
          document_number: string
          document_type: string
          id: string
          notes: string | null
          organization_id: string
          policy_id: string | null
          requested_by: string
          status: Database["public"]["Enums"]["approval_decision"]
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          current_step?: number
          document_id: string
          document_number: string
          document_type: string
          id?: string
          notes?: string | null
          organization_id: string
          policy_id?: string | null
          requested_by: string
          status?: Database["public"]["Enums"]["approval_decision"]
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          current_step?: number
          document_id?: string
          document_number?: string
          document_type?: string
          id?: string
          notes?: string | null
          organization_id?: string
          policy_id?: string | null
          requested_by?: string
          status?: Database["public"]["Enums"]["approval_decision"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "approval_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_steps: {
        Row: {
          approver_role: string
          created_at: string
          id: string
          policy_id: string
          required_approvals: number
          step_number: number
        }
        Insert: {
          approver_role: string
          created_at?: string
          id?: string
          policy_id: string
          required_approvals?: number
          step_number: number
        }
        Update: {
          approver_role?: string
          created_at?: string
          id?: string
          policy_id?: string
          required_approvals?: number
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "approval_steps_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "approval_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          changes: Json | null
          created_at: string
          document_id: string
          document_type: string
          id: string
          ip_address: string | null
          organization_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string
          document_id: string
          document_type: string
          id?: string
          ip_address?: string | null
          organization_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string
          document_id?: string
          document_type?: string
          id?: string
          ip_address?: string | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bom_lines: {
        Row: {
          bom_revision_id: string
          component_type: string
          created_at: string
          id: string
          item_id: string
          line_cost: number | null
          quantity: number
          uom_id: string | null
          wastage_percent: number
        }
        Insert: {
          bom_revision_id: string
          component_type: string
          created_at?: string
          id?: string
          item_id: string
          line_cost?: number | null
          quantity: number
          uom_id?: string | null
          wastage_percent?: number
        }
        Update: {
          bom_revision_id?: string
          component_type?: string
          created_at?: string
          id?: string
          item_id?: string
          line_cost?: number | null
          quantity?: number
          uom_id?: string | null
          wastage_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "bom_lines_bom_revision_id_fkey"
            columns: ["bom_revision_id"]
            isOneToOne: false
            referencedRelation: "bom_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bom_lines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bom_lines_uom_id_fkey"
            columns: ["uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
        ]
      }
      bom_revisions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bom_id: string
          created_at: string
          id: string
          is_released_for_bulk: boolean
          notes: string | null
          output_quantity: number
          revision_number: number
          status: Database["public"]["Enums"]["document_status"]
          uom_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bom_id: string
          created_at?: string
          id?: string
          is_released_for_bulk?: boolean
          notes?: string | null
          output_quantity?: number
          revision_number: number
          status?: Database["public"]["Enums"]["document_status"]
          uom_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bom_id?: string
          created_at?: string
          id?: string
          is_released_for_bulk?: boolean
          notes?: string | null
          output_quantity?: number
          revision_number?: number
          status?: Database["public"]["Enums"]["document_status"]
          uom_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bom_revisions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bom_revisions_bom_id_fkey"
            columns: ["bom_id"]
            isOneToOne: false
            referencedRelation: "boms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bom_revisions_uom_id_fkey"
            columns: ["uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
        ]
      }
      bom_substitutes: {
        Row: {
          bom_line_id: string
          conversion_factor: number
          created_at: string
          id: string
          priority: number
          substitute_item_id: string
        }
        Insert: {
          bom_line_id: string
          conversion_factor?: number
          created_at?: string
          id?: string
          priority?: number
          substitute_item_id: string
        }
        Update: {
          bom_line_id?: string
          conversion_factor?: number
          created_at?: string
          id?: string
          priority?: number
          substitute_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bom_substitutes_bom_line_id_fkey"
            columns: ["bom_line_id"]
            isOneToOne: false
            referencedRelation: "bom_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bom_substitutes_substitute_item_id_fkey"
            columns: ["substitute_item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      boms: {
        Row: {
          bom_number: string
          created_at: string
          customer_id: string | null
          id: string
          is_active: boolean
          is_standard: boolean
          item_id: string
          name: string
          organization_id: string
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          bom_number: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_active?: boolean
          is_standard?: boolean
          item_id: string
          name: string
          organization_id: string
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          bom_number?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_active?: boolean
          is_standard?: boolean
          item_id?: string
          name?: string
          organization_id?: string
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "boms_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boms_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boms_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boms_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      business_units: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_units_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_components: {
        Row: {
          amount: number
          calculation_method: string | null
          component_name: string
          cost_snapshot_id: string
          created_at: string
          id: string
        }
        Insert: {
          amount: number
          calculation_method?: string | null
          component_name: string
          cost_snapshot_id: string
          created_at?: string
          id?: string
        }
        Update: {
          amount?: number
          calculation_method?: string | null
          component_name?: string
          cost_snapshot_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_components_cost_snapshot_id_fkey"
            columns: ["cost_snapshot_id"]
            isOneToOne: false
            referencedRelation: "cost_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_snapshots: {
        Row: {
          calculated_at: string
          created_at: string
          id: string
          item_id: string | null
          job_work_cost: number
          labour_cost: number
          machine_cost: number
          margin_amount: number
          margin_percent: number
          organization_id: string
          overhead_cost: number
          packaging_cost: number
          processing_cost: number
          raw_material_cost: number
          revenue: number
          sales_order_id: string
          total_cost: number
          transport_cost: number
          wastage_cost: number
        }
        Insert: {
          calculated_at?: string
          created_at?: string
          id?: string
          item_id?: string | null
          job_work_cost?: number
          labour_cost?: number
          machine_cost?: number
          margin_amount?: number
          margin_percent?: number
          organization_id: string
          overhead_cost?: number
          packaging_cost?: number
          processing_cost?: number
          raw_material_cost?: number
          revenue?: number
          sales_order_id: string
          total_cost?: number
          transport_cost?: number
          wastage_cost?: number
        }
        Update: {
          calculated_at?: string
          created_at?: string
          id?: string
          item_id?: string | null
          job_work_cost?: number
          labour_cost?: number
          machine_cost?: number
          margin_amount?: number
          margin_percent?: number
          organization_id?: string
          overhead_cost?: number
          packaging_cost?: number
          processing_cost?: number
          raw_material_cost?: number
          revenue?: number
          sales_order_id?: string
          total_cost?: number
          transport_cost?: number
          wastage_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "cost_snapshots_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_snapshots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_snapshots_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_debit_notes: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          id: string
          note_number: string
          note_type: string
          organization_id: string
          reason: string
          sales_invoice_id: string | null
          status: Database["public"]["Enums"]["document_status"]
          tax_amount: number
          total_amount: number
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          id?: string
          note_number: string
          note_type?: string
          organization_id: string
          reason: string
          sales_invoice_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          tax_amount?: number
          total_amount: number
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          id?: string
          note_number?: string
          note_type?: string
          organization_id?: string
          reason?: string
          sales_invoice_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          tax_amount?: number
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "credit_debit_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_debit_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_debit_notes_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          address_type: string
          city: string
          country: string
          created_at: string
          customer_id: string
          id: string
          is_default: boolean
          pincode: string
          state: string
          state_code: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          address_type?: string
          city: string
          country?: string
          created_at?: string
          customer_id: string
          id?: string
          is_default?: boolean
          pincode: string
          state: string
          state_code?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          address_type?: string
          city?: string
          country?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_default?: boolean
          pincode?: string
          state?: string
          state_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_item_aliases: {
        Row: {
          created_at: string
          customer_id: string
          customer_item_code: string
          customer_item_name: string | null
          id: string
          item_id: string
          special_specifications: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          customer_item_code: string
          customer_item_name?: string | null
          id?: string
          item_id: string
          special_specifications?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          customer_item_code?: string
          customer_item_name?: string | null
          id?: string
          item_id?: string
          special_specifications?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_item_aliases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_item_aliases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_item_aliases_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          code: string
          created_at: string
          credit_limit: number | null
          currency: string
          customer_type: string | null
          display_name: string | null
          email: string | null
          gstin: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          pan: string | null
          payment_terms_days: number
          phone: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          credit_limit?: number | null
          currency?: string
          customer_type?: string | null
          display_name?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          pan?: string | null
          payment_terms_days?: number
          phone?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          credit_limit?: number | null
          currency?: string
          customer_type?: string | null
          display_name?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          pan?: string | null
          payment_terms_days?: number
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_challans: {
        Row: {
          challan_number: string
          created_at: string
          created_by: string | null
          customer_id: string
          dispatch_plan_id: string | null
          dispatched_at: string | null
          freight_amount: number | null
          id: string
          lr_number: string | null
          organization_id: string
          sales_order_id: string
          status: Database["public"]["Enums"]["document_status"]
          transporter_id: string | null
          updated_at: string
          vehicle_number: string | null
        }
        Insert: {
          challan_number: string
          created_at?: string
          created_by?: string | null
          customer_id: string
          dispatch_plan_id?: string | null
          dispatched_at?: string | null
          freight_amount?: number | null
          id?: string
          lr_number?: string | null
          organization_id: string
          sales_order_id: string
          status?: Database["public"]["Enums"]["document_status"]
          transporter_id?: string | null
          updated_at?: string
          vehicle_number?: string | null
        }
        Update: {
          challan_number?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string
          dispatch_plan_id?: string | null
          dispatched_at?: string | null
          freight_amount?: number | null
          id?: string
          lr_number?: string | null
          organization_id?: string
          sales_order_id?: string
          status?: Database["public"]["Enums"]["document_status"]
          transporter_id?: string | null
          updated_at?: string
          vehicle_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_challans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_challans_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_challans_dispatch_plan_id_fkey"
            columns: ["dispatch_plan_id"]
            isOneToOne: false
            referencedRelation: "dispatch_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_challans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_challans_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_challans_transporter_id_fkey"
            columns: ["transporter_id"]
            isOneToOne: false
            referencedRelation: "transporters"
            referencedColumns: ["id"]
          },
        ]
      }
      design_briefs: {
        Row: {
          brief_number: string
          created_at: string
          created_by: string | null
          customer_id: string | null
          description: string | null
          id: string
          organization_id: string
          season: string | null
          status: Database["public"]["Enums"]["document_status"]
          target_delivery_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          brief_number: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          organization_id: string
          season?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          target_delivery_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          brief_number?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          organization_id?: string
          season?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          target_delivery_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_briefs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "design_briefs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "design_briefs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatch_allocations: {
        Row: {
          allocated_quantity: number
          created_at: string
          dispatch_plan_id: string
          id: string
          item_id: string
          packed_quantity: number
          picked_quantity: number
          sales_order_line_id: string
          variant_id: string | null
        }
        Insert: {
          allocated_quantity: number
          created_at?: string
          dispatch_plan_id: string
          id?: string
          item_id: string
          packed_quantity?: number
          picked_quantity?: number
          sales_order_line_id: string
          variant_id?: string | null
        }
        Update: {
          allocated_quantity?: number
          created_at?: string
          dispatch_plan_id?: string
          id?: string
          item_id?: string
          packed_quantity?: number
          picked_quantity?: number
          sales_order_line_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_allocations_dispatch_plan_id_fkey"
            columns: ["dispatch_plan_id"]
            isOneToOne: false
            referencedRelation: "dispatch_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_allocations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_allocations_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "sales_order_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_allocations_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatch_plans: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string
          id: string
          organization_id: string
          plan_number: string
          planned_dispatch_date: string
          sales_order_id: string
          shipping_address_id: string | null
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id: string
          id?: string
          organization_id: string
          plan_number: string
          planned_dispatch_date?: string
          sales_order_id: string
          shipping_address_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string
          id?: string
          organization_id?: string
          plan_number?: string
          planned_dispatch_date?: string
          sales_order_id?: string
          shipping_address_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_plans_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_plans_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_plans_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      document_attachments: {
        Row: {
          bucket_name: string
          created_at: string
          document_id: string
          document_type: string
          file_name: string
          file_path: string
          file_size_bytes: number
          id: string
          mime_type: string
          organization_id: string
          uploaded_by: string | null
        }
        Insert: {
          bucket_name?: string
          created_at?: string
          document_id: string
          document_type: string
          file_name: string
          file_path: string
          file_size_bytes: number
          id?: string
          mime_type: string
          organization_id: string
          uploaded_by?: string | null
        }
        Update: {
          bucket_name?: string
          created_at?: string
          document_id?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size_bytes?: number
          id?: string
          mime_type?: string
          organization_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_attachments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_links: {
        Row: {
          created_at: string
          id: string
          link_type: string
          organization_id: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          link_type?: string
          organization_id: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          id?: string
          link_type?: string
          organization_id?: string
          source_id?: string
          source_type?: string
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          code: string
          created_at: string
          department: string
          designation: string | null
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          is_operator: boolean
          location_id: string | null
          organization_id: string
          phone: string | null
        }
        Insert: {
          code: string
          created_at?: string
          department: string
          designation?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          is_operator?: boolean
          location_id?: string | null
          organization_id: string
          phone?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          department?: string
          designation?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          is_operator?: boolean
          location_id?: string | null
          organization_id?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          expense_date: string
          expense_number: string
          id: string
          organization_id: string
          paid_to: string | null
          status: Database["public"]["Enums"]["document_status"]
          tax_amount: number
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          expense_date?: string
          expense_number: string
          id?: string
          organization_id: string
          paid_to?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          tax_amount?: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          expense_date?: string
          expense_number?: string
          id?: string
          organization_id?: string
          paid_to?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          tax_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fabric_rolls: {
        Row: {
          batch: string | null
          created_at: string
          grn_id: string | null
          id: string
          item_id: string
          lot_id: string | null
          organization_id: string
          received_quantity: number
          remaining_quantity: number
          roll_number: string
          shade: string | null
          status: string
          supplier_roll_number: string | null
          uom_id: string | null
          updated_at: string
          warehouse_id: string
        }
        Insert: {
          batch?: string | null
          created_at?: string
          grn_id?: string | null
          id?: string
          item_id: string
          lot_id?: string | null
          organization_id: string
          received_quantity: number
          remaining_quantity: number
          roll_number: string
          shade?: string | null
          status?: string
          supplier_roll_number?: string | null
          uom_id?: string | null
          updated_at?: string
          warehouse_id: string
        }
        Update: {
          batch?: string | null
          created_at?: string
          grn_id?: string | null
          id?: string
          item_id?: string
          lot_id?: string | null
          organization_id?: string
          received_quantity?: number
          remaining_quantity?: number
          roll_number?: string
          shade?: string | null
          status?: string
          supplier_roll_number?: string | null
          uom_id?: string | null
          updated_at?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fabric_rolls_grn_id_fkey"
            columns: ["grn_id"]
            isOneToOne: false
            referencedRelation: "grns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_rolls_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_rolls_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "inventory_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_rolls_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_rolls_uom_id_fkey"
            columns: ["uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_rolls_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      fabrics: {
        Row: {
          composition: string
          construction: string | null
          created_at: string
          cuttable_width_inches: number | null
          default_shade: string | null
          fabric_name: string
          finish: string | null
          gsm: number | null
          id: string
          item_id: string
          organization_id: string
          weave_knit_type: string | null
          width_inches: number | null
        }
        Insert: {
          composition: string
          construction?: string | null
          created_at?: string
          cuttable_width_inches?: number | null
          default_shade?: string | null
          fabric_name: string
          finish?: string | null
          gsm?: number | null
          id?: string
          item_id: string
          organization_id: string
          weave_knit_type?: string | null
          width_inches?: number | null
        }
        Update: {
          composition?: string
          construction?: string | null
          created_at?: string
          cuttable_width_inches?: number | null
          default_shade?: string | null
          fabric_name?: string
          finish?: string | null
          gsm?: number | null
          id?: string
          item_id?: string
          organization_id?: string
          weave_knit_type?: string | null
          width_inches?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fabrics_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      finished_goods_receipts: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          organization_id: string
          production_order_id: string
          quantity: number
          receipt_number: string
          received_date: string
          status: Database["public"]["Enums"]["document_status"]
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id: string
          production_order_id: string
          quantity: number
          receipt_number: string
          received_date?: string
          status?: Database["public"]["Enums"]["document_status"]
          warehouse_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id?: string
          production_order_id?: string
          quantity?: number
          receipt_number?: string
          received_date?: string
          status?: Database["public"]["Enums"]["document_status"]
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "finished_goods_receipts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finished_goods_receipts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finished_goods_receipts_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finished_goods_receipts_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_entries: {
        Row: {
          challan_date: string | null
          created_at: string
          entry_number: string
          entry_time: string
          id: string
          location_id: string
          lr_number: string | null
          organization_id: string
          po_id: string | null
          status: Database["public"]["Enums"]["document_status"]
          supplier_challan_number: string | null
          supplier_id: string
          transporter_name: string | null
          vehicle_number: string | null
        }
        Insert: {
          challan_date?: string | null
          created_at?: string
          entry_number: string
          entry_time?: string
          id?: string
          location_id: string
          lr_number?: string | null
          organization_id: string
          po_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          supplier_challan_number?: string | null
          supplier_id: string
          transporter_name?: string | null
          vehicle_number?: string | null
        }
        Update: {
          challan_date?: string | null
          created_at?: string
          entry_number?: string
          entry_time?: string
          id?: string
          location_id?: string
          lr_number?: string | null
          organization_id?: string
          po_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          supplier_challan_number?: string | null
          supplier_id?: string
          transporter_name?: string | null
          vehicle_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gate_entries_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_entries_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_entries_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      grn_lines: {
        Row: {
          accepted_quantity: number
          created_at: string
          grn_id: string
          hold_quantity: number
          id: string
          item_id: string
          po_line_id: string | null
          received_quantity: number
          rejected_quantity: number
          rejection_reason: string | null
          uom_id: string | null
        }
        Insert: {
          accepted_quantity?: number
          created_at?: string
          grn_id: string
          hold_quantity?: number
          id?: string
          item_id: string
          po_line_id?: string | null
          received_quantity: number
          rejected_quantity?: number
          rejection_reason?: string | null
          uom_id?: string | null
        }
        Update: {
          accepted_quantity?: number
          created_at?: string
          grn_id?: string
          hold_quantity?: number
          id?: string
          item_id?: string
          po_line_id?: string | null
          received_quantity?: number
          rejected_quantity?: number
          rejection_reason?: string | null
          uom_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grn_lines_grn_id_fkey"
            columns: ["grn_id"]
            isOneToOne: false
            referencedRelation: "grns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_lines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_lines_po_line_id_fkey"
            columns: ["po_line_id"]
            isOneToOne: false
            referencedRelation: "purchase_order_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_lines_uom_id_fkey"
            columns: ["uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
        ]
      }
      grns: {
        Row: {
          created_at: string
          created_by: string | null
          gate_entry_id: string | null
          grn_date: string
          grn_number: string
          id: string
          invoice_date: string | null
          location_id: string
          organization_id: string
          po_id: string
          remarks: string | null
          status: Database["public"]["Enums"]["document_status"]
          supplier_id: string
          supplier_invoice_number: string | null
          updated_at: string
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          gate_entry_id?: string | null
          grn_date?: string
          grn_number: string
          id?: string
          invoice_date?: string | null
          location_id: string
          organization_id: string
          po_id: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          supplier_id: string
          supplier_invoice_number?: string | null
          updated_at?: string
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          gate_entry_id?: string | null
          grn_date?: string
          grn_number?: string
          id?: string
          invoice_date?: string | null
          location_id?: string
          organization_id?: string
          po_id?: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          supplier_id?: string
          supplier_invoice_number?: string | null
          updated_at?: string
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grns_gate_entry_id_fkey"
            columns: ["gate_entry_id"]
            isOneToOne: false
            referencedRelation: "gate_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grns_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grns_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grns_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grns_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      hsn_sac_codes: {
        Row: {
          code: string
          created_at: string
          default_tax_rate: number | null
          description: string | null
          id: string
          is_active: boolean
          organization_id: string
          type: string
        }
        Insert: {
          code: string
          created_at?: string
          default_tax_rate?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          organization_id: string
          type?: string
        }
        Update: {
          code?: string
          created_at?: string
          default_tax_rate?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "hsn_sac_codes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_connections: {
        Row: {
          adapter_key: string
          created_at: string
          id: string
          last_synced_at: string | null
          mode: string
          name: string
          organization_id: string
          settings: Json | null
          status: string
        }
        Insert: {
          adapter_key: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          mode?: string
          name: string
          organization_id: string
          settings?: Json | null
          status?: string
        }
        Update: {
          adapter_key?: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          mode?: string
          name?: string
          organization_id?: string
          settings?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_events: {
        Row: {
          adapter_key: string
          connection_id: string | null
          created_at: string
          entity_id: string
          entity_type: string
          error_message: string | null
          event_type: string
          id: string
          organization_id: string
          payload: Json | null
          response: Json | null
          retry_count: number
          status: string
        }
        Insert: {
          adapter_key: string
          connection_id?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          error_message?: string | null
          event_type: string
          id?: string
          organization_id: string
          payload?: Json | null
          response?: Json | null
          retry_count?: number
          status?: string
        }
        Update: {
          adapter_key?: string
          connection_id?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          error_message?: string | null
          event_type?: string
          id?: string
          organization_id?: string
          payload?: Json | null
          response?: Json | null
          retry_count?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_events_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "integration_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_lots: {
        Row: {
          created_at: string
          id: string
          item_id: string
          lot_number: string
          organization_id: string
          status: string
          supplier_id: string | null
          supplier_lot_number: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          lot_number: string
          organization_id: string
          status?: string
          supplier_id?: string | null
          supplier_lot_number?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          lot_number?: string
          organization_id?: string
          status?: string
          supplier_id?: string | null
          supplier_lot_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_lots_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      item_categories: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          item_type: string
          name: string
          organization_id: string
          parent_category_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          item_type: string
          name: string
          organization_id: string
          parent_category_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          item_type?: string
          name?: string
          organization_id?: string
          parent_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "item_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      item_prices: {
        Row: {
          created_at: string
          id: string
          item_id: string
          min_qty: number | null
          price_list_id: string
          rate: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          min_qty?: number | null
          price_list_id: string
          rate: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          min_qty?: number | null
          price_list_id?: string
          rate?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_prices_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_prices_price_list_id_fkey"
            columns: ["price_list_id"]
            isOneToOne: false
            referencedRelation: "price_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_prices_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      item_variants: {
        Row: {
          barcode: string | null
          code: string
          color: string | null
          created_at: string
          id: string
          is_active: boolean
          item_id: string
          name: string
          sales_price: number | null
          shade: string | null
          size: string | null
          sku: string | null
        }
        Insert: {
          barcode?: string | null
          code: string
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          item_id: string
          name: string
          sales_price?: number | null
          shade?: string | null
          size?: string | null
          sku?: string | null
        }
        Update: {
          barcode?: string | null
          code?: string
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          item_id?: string
          name?: string
          sales_price?: number | null
          shade?: string | null
          size?: string | null
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_variants_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          barcode: string | null
          category_id: string | null
          code: string
          created_at: string
          description: string | null
          hsn_sac_code: string | null
          id: string
          is_active: boolean
          is_customer_specific: boolean
          item_type: string
          metadata: Json | null
          name: string
          organization_id: string
          reorder_level: number | null
          reorder_quantity: number | null
          sales_price: number | null
          standard_rate: number | null
          tax_code_id: string | null
          uom_id: string | null
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          code: string
          created_at?: string
          description?: string | null
          hsn_sac_code?: string | null
          id?: string
          is_active?: boolean
          is_customer_specific?: boolean
          item_type: string
          metadata?: Json | null
          name: string
          organization_id: string
          reorder_level?: number | null
          reorder_quantity?: number | null
          sales_price?: number | null
          standard_rate?: number | null
          tax_code_id?: string | null
          uom_id?: string | null
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          code?: string
          created_at?: string
          description?: string | null
          hsn_sac_code?: string | null
          id?: string
          is_active?: boolean
          is_customer_specific?: boolean
          item_type?: string
          metadata?: Json | null
          name?: string
          organization_id?: string
          reorder_level?: number | null
          reorder_quantity?: number | null
          sales_price?: number | null
          standard_rate?: number | null
          tax_code_id?: string | null
          uom_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "item_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_tax_code_id_fkey"
            columns: ["tax_code_id"]
            isOneToOne: false
            referencedRelation: "tax_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_uom_id_fkey"
            columns: ["uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
        ]
      }
      job_work_materials: {
        Row: {
          created_at: string
          id: string
          issued_quantity: number
          item_id: string
          jw_id: string
          returned_quantity: number
          roll_id: string | null
          scrap_quantity: number
          uom_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          issued_quantity: number
          item_id: string
          jw_id: string
          returned_quantity?: number
          roll_id?: string | null
          scrap_quantity?: number
          uom_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          issued_quantity?: number
          item_id?: string
          jw_id?: string
          returned_quantity?: number
          roll_id?: string | null
          scrap_quantity?: number
          uom_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_work_materials_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_work_materials_jw_id_fkey"
            columns: ["jw_id"]
            isOneToOne: false
            referencedRelation: "job_work_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_work_materials_roll_id_fkey"
            columns: ["roll_id"]
            isOneToOne: false
            referencedRelation: "fabric_rolls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_work_materials_uom_id_fkey"
            columns: ["uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
        ]
      }
      job_work_orders: {
        Row: {
          created_at: string
          expected_return_date: string | null
          id: string
          issue_date: string
          jw_number: string
          organization_id: string
          process_name: string
          production_order_id: string | null
          rate_per_unit: number
          status: Database["public"]["Enums"]["document_status"]
          supplier_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expected_return_date?: string | null
          id?: string
          issue_date?: string
          jw_number: string
          organization_id: string
          process_name: string
          production_order_id?: string | null
          rate_per_unit?: number
          status?: Database["public"]["Enums"]["document_status"]
          supplier_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expected_return_date?: string | null
          id?: string
          issue_date?: string
          jw_number?: string
          organization_id?: string
          process_name?: string
          production_order_id?: string | null
          rate_per_unit?: number
          status?: Database["public"]["Enums"]["document_status"]
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_work_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_work_orders_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_work_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      job_work_receipts: {
        Row: {
          accepted_quantity: number
          created_at: string
          id: string
          jw_id: string
          organization_id: string
          receipt_date: string
          receipt_number: string
          received_quantity: number
          rejected_quantity: number
          rework_quantity: number
          status: Database["public"]["Enums"]["document_status"]
        }
        Insert: {
          accepted_quantity?: number
          created_at?: string
          id?: string
          jw_id: string
          organization_id: string
          receipt_date?: string
          receipt_number: string
          received_quantity: number
          rejected_quantity?: number
          rework_quantity?: number
          status?: Database["public"]["Enums"]["document_status"]
        }
        Update: {
          accepted_quantity?: number
          created_at?: string
          id?: string
          jw_id?: string
          organization_id?: string
          receipt_date?: string
          receipt_number?: string
          received_quantity?: number
          rejected_quantity?: number
          rework_quantity?: number
          status?: Database["public"]["Enums"]["document_status"]
        }
        Relationships: [
          {
            foreignKeyName: "job_work_receipts_jw_id_fkey"
            columns: ["jw_id"]
            isOneToOne: false
            referencedRelation: "job_work_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_work_receipts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          business_unit_id: string | null
          city: string | null
          code: string
          created_at: string
          gstin: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          pincode: string | null
          state_code: string | null
          type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_unit_id?: string | null
          city?: string | null
          code: string
          created_at?: string
          gstin?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          pincode?: string | null
          state_code?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_unit_id?: string | null
          city?: string | null
          code?: string
          created_at?: string
          gstin?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          pincode?: string | null
          state_code?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_business_unit_id_fkey"
            columns: ["business_unit_id"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          capacity_per_hour: number | null
          code: string
          created_at: string
          department: string
          id: string
          is_active: boolean
          location_id: string
          machine_type: string
          name: string
          organization_id: string
          status: string
          uom_id: string | null
        }
        Insert: {
          capacity_per_hour?: number | null
          code: string
          created_at?: string
          department: string
          id?: string
          is_active?: boolean
          location_id: string
          machine_type: string
          name: string
          organization_id: string
          status?: string
          uom_id?: string | null
        }
        Update: {
          capacity_per_hour?: number | null
          code?: string
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean
          location_id?: string
          machine_type?: string
          name?: string
          organization_id?: string
          status?: string
          uom_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "machines_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machines_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machines_uom_id_fkey"
            columns: ["uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
        ]
      }
      material_issue_lines: {
        Row: {
          created_at: string
          id: string
          issued_quantity: number
          item_id: string
          lot_id: string | null
          material_issue_id: string
          planned_quantity: number
          roll_id: string | null
          uom_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          issued_quantity: number
          item_id: string
          lot_id?: string | null
          material_issue_id: string
          planned_quantity: number
          roll_id?: string | null
          uom_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          issued_quantity?: number
          item_id?: string
          lot_id?: string | null
          material_issue_id?: string
          planned_quantity?: number
          roll_id?: string | null
          uom_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_issue_lines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_issue_lines_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "inventory_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_issue_lines_material_issue_id_fkey"
            columns: ["material_issue_id"]
            isOneToOne: false
            referencedRelation: "material_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_issue_lines_roll_id_fkey"
            columns: ["roll_id"]
            isOneToOne: false
            referencedRelation: "fabric_rolls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_issue_lines_uom_id_fkey"
            columns: ["uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
        ]
      }
      material_issues: {
        Row: {
          created_at: string
          id: string
          issue_date: string
          issue_number: string
          issued_by: string | null
          organization_id: string
          production_order_id: string
          status: Database["public"]["Enums"]["document_status"]
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_date?: string
          issue_number: string
          issued_by?: string | null
          organization_id: string
          production_order_id: string
          status?: Database["public"]["Enums"]["document_status"]
          warehouse_id: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_date?: string
          issue_number?: string
          issued_by?: string | null
          organization_id?: string
          production_order_id?: string
          status?: Database["public"]["Enums"]["document_status"]
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_issues_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_issues_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_issues_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_issues_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      material_plan_lines: {
        Row: {
          available_stock: number
          created_at: string
          id: string
          is_ordered: boolean
          item_id: string
          material_plan_id: string
          required_quantity: number
          reserved_stock: number
          shortage_quantity: number
          suggested_action: string
          uom_id: string | null
        }
        Insert: {
          available_stock?: number
          created_at?: string
          id?: string
          is_ordered?: boolean
          item_id: string
          material_plan_id: string
          required_quantity: number
          reserved_stock?: number
          shortage_quantity?: number
          suggested_action?: string
          uom_id?: string | null
        }
        Update: {
          available_stock?: number
          created_at?: string
          id?: string
          is_ordered?: boolean
          item_id?: string
          material_plan_id?: string
          required_quantity?: number
          reserved_stock?: number
          shortage_quantity?: number
          suggested_action?: string
          uom_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_plan_lines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_plan_lines_material_plan_id_fkey"
            columns: ["material_plan_id"]
            isOneToOne: false
            referencedRelation: "material_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_plan_lines_uom_id_fkey"
            columns: ["uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
        ]
      }
      material_plans: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          plan_date: string
          plan_number: string
          sales_order_id: string
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          plan_date?: string
          plan_number: string
          sales_order_id: string
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          plan_date?: string
          plan_number?: string
          sales_order_id?: string
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_plans_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      operations: {
        Row: {
          code: string
          cost_per_minute: number | null
          created_at: string
          default_machine_id: string | null
          department: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          standard_time_minutes: number | null
        }
        Insert: {
          code: string
          cost_per_minute?: number | null
          created_at?: string
          default_machine_id?: string | null
          department: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          standard_time_minutes?: number | null
        }
        Update: {
          code?: string
          cost_per_minute?: number | null
          created_at?: string
          default_machine_id?: string | null
          department?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          standard_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "operations_default_machine_id_fkey"
            columns: ["default_machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          organization_id: string
          profile_id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          organization_id: string
          profile_id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          organization_id?: string
          profile_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          code: string
          created_at: string
          currency: string
          gstin: string | null
          id: string
          is_active: boolean
          legal_name: string | null
          metadata: Json | null
          name: string
          pan: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          gstin?: string | null
          id?: string
          is_active?: boolean
          legal_name?: string | null
          metadata?: Json | null
          name: string
          pan?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          gstin?: string | null
          id?: string
          is_active?: boolean
          legal_name?: string | null
          metadata?: Json | null
          name?: string
          pan?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      packing_lists: {
        Row: {
          created_at: string
          dispatch_plan_id: string
          id: string
          organization_id: string
          packing_list_number: string
          status: Database["public"]["Enums"]["document_status"]
          total_packages: number
          total_weight_kg: number | null
        }
        Insert: {
          created_at?: string
          dispatch_plan_id: string
          id?: string
          organization_id: string
          packing_list_number: string
          status?: Database["public"]["Enums"]["document_status"]
          total_packages?: number
          total_weight_kg?: number | null
        }
        Update: {
          created_at?: string
          dispatch_plan_id?: string
          id?: string
          organization_id?: string
          packing_list_number?: string
          status?: Database["public"]["Enums"]["document_status"]
          total_packages?: number
          total_weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "packing_lists_dispatch_plan_id_fkey"
            columns: ["dispatch_plan_id"]
            isOneToOne: false
            referencedRelation: "dispatch_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_lists_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_entries: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          id: string
          organization_id: string
          payment_date: string
          payment_mode: string
          payment_number: string
          reference_number: string | null
          sales_invoice_id: string | null
          status: Database["public"]["Enums"]["document_status"]
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          id?: string
          organization_id: string
          payment_date?: string
          payment_mode?: string
          payment_number: string
          reference_number?: string | null
          sales_invoice_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          id?: string
          organization_id?: string
          payment_date?: string
          payment_mode?: string
          payment_number?: string
          reference_number?: string | null
          sales_invoice_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payment_entries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_entries_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      pick_lists: {
        Row: {
          created_at: string
          dispatch_plan_id: string
          id: string
          organization_id: string
          pick_list_number: string
          picked_by: string | null
          status: Database["public"]["Enums"]["document_status"]
        }
        Insert: {
          created_at?: string
          dispatch_plan_id: string
          id?: string
          organization_id: string
          pick_list_number: string
          picked_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
        }
        Update: {
          created_at?: string
          dispatch_plan_id?: string
          id?: string
          organization_id?: string
          pick_list_number?: string
          picked_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
        }
        Relationships: [
          {
            foreignKeyName: "pick_lists_dispatch_plan_id_fkey"
            columns: ["dispatch_plan_id"]
            isOneToOne: false
            referencedRelation: "dispatch_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_lists_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_lists_picked_by_fkey"
            columns: ["picked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_lists: {
        Row: {
          code: string
          created_at: string
          currency: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_lists_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_specifications: {
        Row: {
          brief_id: string | null
          created_at: string
          current_revision: number
          customer_id: string | null
          id: string
          is_bulk_released: boolean
          item_id: string | null
          organization_id: string
          spec_number: string
          status: Database["public"]["Enums"]["document_status"]
          title: string
          updated_at: string
        }
        Insert: {
          brief_id?: string | null
          created_at?: string
          current_revision?: number
          customer_id?: string | null
          id?: string
          is_bulk_released?: boolean
          item_id?: string | null
          organization_id: string
          spec_number: string
          status?: Database["public"]["Enums"]["document_status"]
          title: string
          updated_at?: string
        }
        Update: {
          brief_id?: string | null
          created_at?: string
          current_revision?: number
          customer_id?: string | null
          id?: string
          is_bulk_released?: boolean
          item_id?: string | null
          organization_id?: string
          spec_number?: string
          status?: Database["public"]["Enums"]["document_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_specifications_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "design_briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_specifications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_specifications_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_specifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      production_entries: {
        Row: {
          created_at: string
          created_by: string | null
          entry_date: string
          entry_number: string
          good_quantity: number
          id: string
          operation_id: string | null
          organization_id: string
          production_order_id: string
          remarks: string | null
          rework_quantity: number
          scrap_quantity: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entry_date?: string
          entry_number: string
          good_quantity: number
          id?: string
          operation_id?: string | null
          organization_id: string
          production_order_id: string
          remarks?: string | null
          rework_quantity?: number
          scrap_quantity?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entry_date?: string
          entry_number?: string
          good_quantity?: number
          id?: string
          operation_id?: string | null
          organization_id?: string
          production_order_id?: string
          remarks?: string | null
          rework_quantity?: number
          scrap_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "production_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_entries_operation_id_fkey"
            columns: ["operation_id"]
            isOneToOne: false
            referencedRelation: "production_operations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_entries_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      production_operations: {
        Row: {
          completed_at: string | null
          completed_quantity: number
          created_at: string
          id: string
          machine_id: string | null
          operation_name: string
          operator_id: string | null
          planned_quantity: number
          production_order_id: string
          rejected_quantity: number
          rework_quantity: number
          scrap_quantity: number
          started_at: string | null
          status: Database["public"]["Enums"]["document_status"]
          step_number: number
        }
        Insert: {
          completed_at?: string | null
          completed_quantity?: number
          created_at?: string
          id?: string
          machine_id?: string | null
          operation_name: string
          operator_id?: string | null
          planned_quantity: number
          production_order_id: string
          rejected_quantity?: number
          rework_quantity?: number
          scrap_quantity?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          step_number: number
        }
        Update: {
          completed_at?: string | null
          completed_quantity?: number
          created_at?: string
          id?: string
          machine_id?: string | null
          operation_name?: string
          operator_id?: string | null
          planned_quantity?: number
          production_order_id?: string
          rejected_quantity?: number
          rework_quantity?: number
          scrap_quantity?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "production_operations_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_operations_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_operations_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      production_orders: {
        Row: {
          bom_revision_id: string | null
          completed_quantity: number
          created_at: string
          created_by: string | null
          due_date: string | null
          id: string
          item_id: string
          order_number: string
          organization_id: string
          planned_quantity: number
          production_plan_id: string | null
          sales_order_id: string | null
          scrapped_quantity: number
          start_date: string | null
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          bom_revision_id?: string | null
          completed_quantity?: number
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          item_id: string
          order_number: string
          organization_id: string
          planned_quantity: number
          production_plan_id?: string | null
          sales_order_id?: string | null
          scrapped_quantity?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          bom_revision_id?: string | null
          completed_quantity?: number
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          item_id?: string
          order_number?: string
          organization_id?: string
          planned_quantity?: number
          production_plan_id?: string | null
          sales_order_id?: string | null
          scrapped_quantity?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_orders_bom_revision_id_fkey"
            columns: ["bom_revision_id"]
            isOneToOne: false
            referencedRelation: "bom_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_production_plan_id_fkey"
            columns: ["production_plan_id"]
            isOneToOne: false
            referencedRelation: "production_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      production_plans: {
        Row: {
          created_at: string
          id: string
          location_id: string
          organization_id: string
          plan_date: string
          plan_number: string
          sales_order_id: string | null
          status: Database["public"]["Enums"]["document_status"]
          target_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          organization_id: string
          plan_date?: string
          plan_number: string
          sales_order_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          organization_id?: string
          plan_date?: string
          plan_number?: string
          sales_order_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_plans_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_plans_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          default_location_id: string | null
          default_organization_id: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          default_location_id?: string | null
          default_organization_id?: string | null
          email: string
          full_name: string
          id: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          default_location_id?: string | null
          default_organization_id?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_default_location_id_fkey"
            columns: ["default_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_default_organization_id_fkey"
            columns: ["default_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      proofs_of_delivery: {
        Row: {
          attachment_id: string | null
          created_at: string
          delivery_challan_id: string
          id: string
          received_at: string
          received_by_name: string
          remarks: string | null
        }
        Insert: {
          attachment_id?: string | null
          created_at?: string
          delivery_challan_id: string
          id?: string
          received_at?: string
          received_by_name: string
          remarks?: string | null
        }
        Update: {
          attachment_id?: string | null
          created_at?: string
          delivery_challan_id?: string
          id?: string
          received_at?: string
          received_by_name?: string
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proofs_of_delivery_attachment_id_fkey"
            columns: ["attachment_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proofs_of_delivery_delivery_challan_id_fkey"
            columns: ["delivery_challan_id"]
            isOneToOne: false
            referencedRelation: "delivery_challans"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_invoices: {
        Row: {
          created_at: string
          due_date: string | null
          grn_id: string | null
          id: string
          invoice_date: string
          invoice_number: string
          organization_id: string
          paid_amount: number
          po_id: string | null
          status: Database["public"]["Enums"]["document_status"]
          subtotal: number
          supplier_id: string
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          grn_id?: string | null
          id?: string
          invoice_date?: string
          invoice_number: string
          organization_id: string
          paid_amount?: number
          po_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          subtotal?: number
          supplier_id: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          grn_id?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          organization_id?: string
          paid_amount?: number
          po_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          subtotal?: number
          supplier_id?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_invoices_grn_id_fkey"
            columns: ["grn_id"]
            isOneToOne: false
            referencedRelation: "grns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_invoices_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_lines: {
        Row: {
          billed_quantity: number
          created_at: string
          id: string
          item_id: string
          po_id: string
          quantity: number
          rate: number
          received_quantity: number
          tax_amount: number
          tax_code_id: string | null
          total_amount: number
        }
        Insert: {
          billed_quantity?: number
          created_at?: string
          id?: string
          item_id: string
          po_id: string
          quantity: number
          rate: number
          received_quantity?: number
          tax_amount?: number
          tax_code_id?: string | null
          total_amount: number
        }
        Update: {
          billed_quantity?: number
          created_at?: string
          id?: string
          item_id?: string
          po_id?: string
          quantity?: number
          rate?: number
          received_quantity?: number
          tax_amount?: number
          tax_code_id?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_lines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_lines_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_lines_tax_code_id_fkey"
            columns: ["tax_code_id"]
            isOneToOne: false
            referencedRelation: "tax_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string
          expected_delivery_date: string | null
          id: string
          order_date: string
          organization_id: string
          payment_terms: string | null
          po_number: string
          pr_id: string | null
          shipping_location_id: string | null
          status: Database["public"]["Enums"]["document_status"]
          subtotal: number
          supplier_id: string
          supplier_quotation_id: string | null
          tax_amount: number
          total_amount: number
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string
          expected_delivery_date?: string | null
          id?: string
          order_date?: string
          organization_id: string
          payment_terms?: string | null
          po_number: string
          pr_id?: string | null
          shipping_location_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          subtotal?: number
          supplier_id: string
          supplier_quotation_id?: string | null
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string
          expected_delivery_date?: string | null
          id?: string
          order_date?: string
          organization_id?: string
          payment_terms?: string | null
          po_number?: string
          pr_id?: string | null
          shipping_location_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          subtotal?: number
          supplier_id?: string
          supplier_quotation_id?: string | null
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_pr_id_fkey"
            columns: ["pr_id"]
            isOneToOne: false
            referencedRelation: "purchase_requisitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_shipping_location_id_fkey"
            columns: ["shipping_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_quotation_id_fkey"
            columns: ["supplier_quotation_id"]
            isOneToOne: false
            referencedRelation: "supplier_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_requisition_lines: {
        Row: {
          created_at: string
          id: string
          item_id: string
          notes: string | null
          pr_id: string
          quantity: number
          uom_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          notes?: string | null
          pr_id: string
          quantity: number
          uom_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          notes?: string | null
          pr_id?: string
          quantity?: number
          uom_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_requisition_lines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requisition_lines_pr_id_fkey"
            columns: ["pr_id"]
            isOneToOne: false
            referencedRelation: "purchase_requisitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requisition_lines_uom_id_fkey"
            columns: ["uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_requisitions: {
        Row: {
          created_at: string
          created_by: string | null
          department: string | null
          id: string
          material_plan_id: string | null
          organization_id: string
          pr_number: string
          required_by: string | null
          requisition_date: string
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department?: string | null
          id?: string
          material_plan_id?: string | null
          organization_id: string
          pr_number: string
          required_by?: string | null
          requisition_date?: string
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department?: string | null
          id?: string
          material_plan_id?: string | null
          organization_id?: string
          pr_number?: string
          required_by?: string | null
          requisition_date?: string
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_requisitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requisitions_material_plan_id_fkey"
            columns: ["material_plan_id"]
            isOneToOne: false
            referencedRelation: "material_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requisitions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_inspections: {
        Row: {
          accepted_quantity: number
          created_at: string
          disposition: string
          hold_quantity: number
          id: string
          inspected_quantity: number
          inspection_number: string
          inspection_type: string
          inspector_id: string | null
          item_id: string | null
          organization_id: string
          reference_id: string
          reference_type: string
          rejected_quantity: number
          remarks: string | null
          sample_size: number
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
        }
        Insert: {
          accepted_quantity?: number
          created_at?: string
          disposition?: string
          hold_quantity?: number
          id?: string
          inspected_quantity: number
          inspection_number: string
          inspection_type: string
          inspector_id?: string | null
          item_id?: string | null
          organization_id: string
          reference_id: string
          reference_type: string
          rejected_quantity?: number
          remarks?: string | null
          sample_size?: number
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Update: {
          accepted_quantity?: number
          created_at?: string
          disposition?: string
          hold_quantity?: number
          id?: string
          inspected_quantity?: number
          inspection_number?: string
          inspection_type?: string
          inspector_id?: string | null
          item_id?: string | null
          organization_id?: string
          reference_id?: string
          reference_type?: string
          rejected_quantity?: number
          remarks?: string | null
          sample_size?: number
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_inspections_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_inspections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_results: {
        Row: {
          actual_value: string | null
          comments: string | null
          created_at: string
          id: string
          inspection_id: string
          parameter_name: string
          result: string
          standard_value: string | null
        }
        Insert: {
          actual_value?: string | null
          comments?: string | null
          created_at?: string
          id?: string
          inspection_id: string
          parameter_name: string
          result?: string
          standard_value?: string | null
        }
        Update: {
          actual_value?: string | null
          comments?: string | null
          created_at?: string
          id?: string
          inspection_id?: string
          parameter_name?: string
          result?: string
          standard_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quality_results_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "quality_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_templates: {
        Row: {
          created_at: string
          id: string
          inspection_type: string
          is_active: boolean
          organization_id: string
          parameters: Json
          template_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          inspection_type: string
          is_active?: boolean
          organization_id: string
          parameters?: Json
          template_name: string
        }
        Update: {
          created_at?: string
          id?: string
          inspection_type?: string
          is_active?: boolean
          organization_id?: string
          parameters?: Json
          template_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_lines: {
        Row: {
          created_at: string
          description: string | null
          id: string
          item_id: string
          quantity: number
          quotation_id: string
          rate: number
          tax_amount: number
          tax_code_id: string | null
          total_amount: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          item_id: string
          quantity: number
          quotation_id: string
          rate: number
          tax_amount?: number
          tax_code_id?: string | null
          total_amount: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          item_id?: string
          quantity?: number
          quotation_id?: string
          rate?: number
          tax_amount?: number
          tax_code_id?: string | null
          total_amount?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_lines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_lines_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_lines_tax_code_id_fkey"
            columns: ["tax_code_id"]
            isOneToOne: false
            referencedRelation: "tax_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_lines_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          created_at: string
          customer_id: string
          enquiry_id: string | null
          id: string
          organization_id: string
          payment_terms: string | null
          quotation_date: string
          quotation_number: string
          status: Database["public"]["Enums"]["document_status"]
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          enquiry_id?: string | null
          id?: string
          organization_id: string
          payment_terms?: string | null
          quotation_date?: string
          quotation_number: string
          status?: Database["public"]["Enums"]["document_status"]
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          enquiry_id?: string | null
          id?: string
          organization_id?: string
          payment_terms?: string | null
          quotation_date?: string
          quotation_number?: string
          status?: Database["public"]["Enums"]["document_status"]
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "sales_enquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rework_orders: {
        Row: {
          created_at: string
          defect_description: string
          id: string
          inspection_id: string | null
          organization_id: string
          production_order_id: string | null
          quantity: number
          rework_number: string
          status: Database["public"]["Enums"]["document_status"]
          target_operation: string | null
        }
        Insert: {
          created_at?: string
          defect_description: string
          id?: string
          inspection_id?: string | null
          organization_id: string
          production_order_id?: string | null
          quantity: number
          rework_number: string
          status?: Database["public"]["Enums"]["document_status"]
          target_operation?: string | null
        }
        Update: {
          created_at?: string
          defect_description?: string
          id?: string
          inspection_id?: string | null
          organization_id?: string
          production_order_id?: string | null
          quantity?: number
          rework_number?: string
          status?: Database["public"]["Enums"]["document_status"]
          target_operation?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rework_orders_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "quality_inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rework_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rework_orders_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          closing_date: string | null
          created_at: string
          id: string
          organization_id: string
          pr_id: string | null
          rfq_date: string
          rfq_number: string
          status: Database["public"]["Enums"]["document_status"]
        }
        Insert: {
          closing_date?: string | null
          created_at?: string
          id?: string
          organization_id: string
          pr_id?: string | null
          rfq_date?: string
          rfq_number: string
          status?: Database["public"]["Enums"]["document_status"]
        }
        Update: {
          closing_date?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          pr_id?: string | null
          rfq_date?: string
          rfq_number?: string
          status?: Database["public"]["Enums"]["document_status"]
        }
        Relationships: [
          {
            foreignKeyName: "rfqs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfqs_pr_id_fkey"
            columns: ["pr_id"]
            isOneToOne: false
            referencedRelation: "purchase_requisitions"
            referencedColumns: ["id"]
          },
        ]
      }
      routing_steps: {
        Row: {
          bom_revision_id: string
          created_at: string
          id: string
          machine_id: string | null
          operation_id: string
          run_time_minutes: number | null
          setup_time_minutes: number | null
          step_number: number
        }
        Insert: {
          bom_revision_id: string
          created_at?: string
          id?: string
          machine_id?: string | null
          operation_id: string
          run_time_minutes?: number | null
          setup_time_minutes?: number | null
          step_number: number
        }
        Update: {
          bom_revision_id?: string
          created_at?: string
          id?: string
          machine_id?: string | null
          operation_id?: string
          run_time_minutes?: number | null
          setup_time_minutes?: number | null
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "routing_steps_bom_revision_id_fkey"
            columns: ["bom_revision_id"]
            isOneToOne: false
            referencedRelation: "bom_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routing_steps_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routing_steps_operation_id_fkey"
            columns: ["operation_id"]
            isOneToOne: false
            referencedRelation: "operations"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_enquiries: {
        Row: {
          created_at: string
          customer_id: string
          enquiry_date: string
          enquiry_number: string
          id: string
          organization_id: string
          requirements: string | null
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          enquiry_date?: string
          enquiry_number: string
          id?: string
          organization_id: string
          requirements?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          enquiry_date?: string
          enquiry_number?: string
          id?: string
          organization_id?: string
          requirements?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_enquiries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_enquiries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_invoice_lines: {
        Row: {
          created_at: string
          description: string | null
          id: string
          item_id: string
          quantity: number
          rate: number
          sales_invoice_id: string
          sales_order_line_id: string | null
          tax_amount: number
          tax_code_id: string | null
          total_amount: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          item_id: string
          quantity: number
          rate: number
          sales_invoice_id: string
          sales_order_line_id?: string | null
          tax_amount?: number
          tax_code_id?: string | null
          total_amount: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          item_id?: string
          quantity?: number
          rate?: number
          sales_invoice_id?: string
          sales_order_line_id?: string | null
          tax_amount?: number
          tax_code_id?: string | null
          total_amount?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_invoice_lines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoice_lines_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoice_lines_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "sales_order_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoice_lines_tax_code_id_fkey"
            columns: ["tax_code_id"]
            isOneToOne: false
            referencedRelation: "tax_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoice_lines_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_invoices: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string
          delivery_challan_id: string | null
          due_date: string | null
          eway_bill_number: string | null
          freight_charges: number
          id: string
          invoice_date: string
          invoice_number: string
          invoice_type: string
          irn: string | null
          organization_id: string
          paid_amount: number
          qr_code: string | null
          sales_order_id: string
          status: Database["public"]["Enums"]["document_status"]
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id: string
          delivery_challan_id?: string | null
          due_date?: string | null
          eway_bill_number?: string | null
          freight_charges?: number
          id?: string
          invoice_date?: string
          invoice_number: string
          invoice_type?: string
          irn?: string | null
          organization_id: string
          paid_amount?: number
          qr_code?: string | null
          sales_order_id: string
          status?: Database["public"]["Enums"]["document_status"]
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string
          delivery_challan_id?: string | null
          due_date?: string | null
          eway_bill_number?: string | null
          freight_charges?: number
          id?: string
          invoice_date?: string
          invoice_number?: string
          invoice_type?: string
          irn?: string | null
          organization_id?: string
          paid_amount?: number
          qr_code?: string | null
          sales_order_id?: string
          status?: Database["public"]["Enums"]["document_status"]
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoices_delivery_challan_id_fkey"
            columns: ["delivery_challan_id"]
            isOneToOne: false
            referencedRelation: "delivery_challans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoices_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_order_lines: {
        Row: {
          created_at: string
          customer_item_code: string | null
          dispatched_quantity: number
          id: string
          invoiced_quantity: number
          item_id: string
          quantity: number
          rate: number
          sales_order_id: string
          tax_amount: number
          tax_code_id: string | null
          total_amount: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          customer_item_code?: string | null
          dispatched_quantity?: number
          id?: string
          invoiced_quantity?: number
          item_id: string
          quantity: number
          rate: number
          sales_order_id: string
          tax_amount?: number
          tax_code_id?: string | null
          total_amount: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          customer_item_code?: string | null
          dispatched_quantity?: number
          id?: string
          invoiced_quantity?: number
          item_id?: string
          quantity?: number
          rate?: number
          sales_order_id?: string
          tax_amount?: number
          tax_code_id?: string | null
          total_amount?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_lines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_lines_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_lines_tax_code_id_fkey"
            columns: ["tax_code_id"]
            isOneToOne: false
            referencedRelation: "tax_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_lines_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_orders: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string
          customer_po_reference: string | null
          expected_delivery_date: string | null
          id: string
          order_date: string
          order_number: string
          organization_id: string
          packaging_instructions: string | null
          payment_terms: string | null
          quotation_id: string | null
          spec_revision_id: string | null
          special_specifications: string | null
          status: Database["public"]["Enums"]["document_status"]
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id: string
          customer_po_reference?: string | null
          expected_delivery_date?: string | null
          id?: string
          order_date?: string
          order_number: string
          organization_id: string
          packaging_instructions?: string | null
          payment_terms?: string | null
          quotation_id?: string | null
          spec_revision_id?: string | null
          special_specifications?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string
          customer_po_reference?: string | null
          expected_delivery_date?: string | null
          id?: string
          order_date?: string
          order_number?: string
          organization_id?: string
          packaging_instructions?: string | null
          payment_terms?: string | null
          quotation_id?: string | null
          spec_revision_id?: string | null
          special_specifications?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_orders_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_orders_spec_revision_id_fkey"
            columns: ["spec_revision_id"]
            isOneToOne: false
            referencedRelation: "specification_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_iterations: {
        Row: {
          created_at: string
          customer_feedback: string | null
          decided_at: string | null
          decided_by: string | null
          decision: Database["public"]["Enums"]["approval_decision"]
          id: string
          iteration_number: number
          materials_used: string | null
          observations: string | null
          qc_result: string | null
          sample_request_id: string
        }
        Insert: {
          created_at?: string
          customer_feedback?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision?: Database["public"]["Enums"]["approval_decision"]
          id?: string
          iteration_number: number
          materials_used?: string | null
          observations?: string | null
          qc_result?: string | null
          sample_request_id: string
        }
        Update: {
          created_at?: string
          customer_feedback?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision?: Database["public"]["Enums"]["approval_decision"]
          id?: string
          iteration_number?: number
          materials_used?: string | null
          observations?: string | null
          qc_result?: string | null
          sample_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sample_iterations_decided_by_fkey"
            columns: ["decided_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sample_iterations_sample_request_id_fkey"
            columns: ["sample_request_id"]
            isOneToOne: false
            referencedRelation: "sample_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_requests: {
        Row: {
          assigned_location_id: string | null
          created_at: string
          customer_id: string
          id: string
          organization_id: string
          quantity: number
          request_number: string
          required_by: string | null
          spec_id: string
          spec_revision_id: string | null
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
        }
        Insert: {
          assigned_location_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          organization_id: string
          quantity?: number
          request_number: string
          required_by?: string | null
          spec_id: string
          spec_revision_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Update: {
          assigned_location_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          organization_id?: string
          quantity?: number
          request_number?: string
          required_by?: string | null
          spec_id?: string
          spec_revision_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sample_requests_assigned_location_id_fkey"
            columns: ["assigned_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sample_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sample_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sample_requests_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "product_specifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sample_requests_spec_revision_id_fkey"
            columns: ["spec_revision_id"]
            isOneToOne: false
            referencedRelation: "specification_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      scrap_entries: {
        Row: {
          created_at: string
          id: string
          item_id: string
          organization_id: string
          quantity: number
          reason: string
          reference_id: string
          reference_type: string
          scrap_number: string
          status: Database["public"]["Enums"]["document_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          organization_id: string
          quantity: number
          reason: string
          reference_id: string
          reference_type: string
          scrap_number: string
          status?: Database["public"]["Enums"]["document_status"]
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          organization_id?: string
          quantity?: number
          reason?: string
          reference_id?: string
          reference_type?: string
          scrap_number?: string
          status?: Database["public"]["Enums"]["document_status"]
        }
        Relationships: [
          {
            foreignKeyName: "scrap_entries_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrap_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          break_minutes: number | null
          code: string
          created_at: string
          end_time: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          start_time: string
        }
        Insert: {
          break_minutes?: number | null
          code: string
          created_at?: string
          end_time: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          start_time: string
        }
        Update: {
          break_minutes?: number | null
          code?: string
          created_at?: string
          end_time?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          current_location: string | null
          delivery_challan_id: string
          estimated_arrival: string | null
          id: string
          status: string
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          current_location?: string | null
          delivery_challan_id: string
          estimated_arrival?: string | null
          id?: string
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          current_location?: string | null
          delivery_challan_id?: string
          estimated_arrival?: string | null
          id?: string
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_delivery_challan_id_fkey"
            columns: ["delivery_challan_id"]
            isOneToOne: false
            referencedRelation: "delivery_challans"
            referencedColumns: ["id"]
          },
        ]
      }
      specification_revisions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          colorways: Json | null
          created_at: string
          fabric_details: string | null
          id: string
          is_released_for_bulk: boolean
          measurements: Json | null
          revision_number: number
          spec_id: string
          special_instructions: string | null
          status: Database["public"]["Enums"]["document_status"]
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          colorways?: Json | null
          created_at?: string
          fabric_details?: string | null
          id?: string
          is_released_for_bulk?: boolean
          measurements?: Json | null
          revision_number: number
          spec_id: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["document_status"]
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          colorways?: Json | null
          created_at?: string
          fabric_details?: string | null
          id?: string
          is_released_for_bulk?: boolean
          measurements?: Json | null
          revision_number?: number
          spec_id?: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["document_status"]
        }
        Relationships: [
          {
            foreignKeyName: "specification_revisions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specification_revisions_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "product_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_ledger_entries: {
        Row: {
          bin_id: string | null
          created_at: string
          id: string
          item_id: string
          lot_id: string | null
          organization_id: string
          posting_date: string
          quantity_delta: number
          remarks: string | null
          roll_id: string | null
          running_balance: number
          valuation_rate: number
          variant_id: string | null
          voucher_id: string
          voucher_type: string
          warehouse_id: string
        }
        Insert: {
          bin_id?: string | null
          created_at?: string
          id?: string
          item_id: string
          lot_id?: string | null
          organization_id: string
          posting_date?: string
          quantity_delta: number
          remarks?: string | null
          roll_id?: string | null
          running_balance?: number
          valuation_rate?: number
          variant_id?: string | null
          voucher_id: string
          voucher_type: string
          warehouse_id: string
        }
        Update: {
          bin_id?: string | null
          created_at?: string
          id?: string
          item_id?: string
          lot_id?: string | null
          organization_id?: string
          posting_date?: string
          quantity_delta?: number
          remarks?: string | null
          roll_id?: string | null
          running_balance?: number
          valuation_rate?: number
          variant_id?: string | null
          voucher_id?: string
          voucher_type?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_ledger_entries_bin_id_fkey"
            columns: ["bin_id"]
            isOneToOne: false
            referencedRelation: "storage_bins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_entries_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_entries_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "inventory_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_entries_roll_id_fkey"
            columns: ["roll_id"]
            isOneToOne: false
            referencedRelation: "fabric_rolls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_entries_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_entries_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_reservations: {
        Row: {
          created_at: string
          id: string
          item_id: string
          organization_id: string
          reserved_quantity: number
          roll_id: string | null
          sales_order_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          organization_id: string
          reserved_quantity: number
          roll_id?: string | null
          sales_order_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          organization_id?: string
          reserved_quantity?: number
          roll_id?: string | null
          sales_order_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_reservations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_reservations_roll_id_fkey"
            columns: ["roll_id"]
            isOneToOne: false
            referencedRelation: "fabric_rolls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_reservations_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_bins: {
        Row: {
          bin: string | null
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string | null
          rack: string | null
          shelf: string | null
          updated_at: string
          warehouse_id: string
        }
        Insert: {
          bin?: string | null
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string | null
          rack?: string | null
          shelf?: string | null
          updated_at?: string
          warehouse_id: string
        }
        Update: {
          bin?: string | null
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string | null
          rack?: string | null
          shelf?: string | null
          updated_at?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_bins_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          address_type: string
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean
          pincode: string
          state: string
          state_code: string
          supplier_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          address_type?: string
          city: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          pincode: string
          state: string
          state_code?: string
          supplier_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          address_type?: string
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          pincode?: string
          state?: string
          state_code?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_addresses_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          organization_id: string
          payment_date: string
          payment_mode: string
          payment_number: string
          purchase_invoice_id: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["document_status"]
          supplier_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          organization_id: string
          payment_date?: string
          payment_mode?: string
          payment_number: string
          purchase_invoice_id?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          supplier_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          organization_id?: string
          payment_date?: string
          payment_mode?: string
          payment_number?: string
          purchase_invoice_id?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_payments_purchase_invoice_id_fkey"
            columns: ["purchase_invoice_id"]
            isOneToOne: false
            referencedRelation: "purchase_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_payments_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_quotations: {
        Row: {
          created_at: string
          id: string
          lead_time_days: number | null
          organization_id: string
          payment_terms: string | null
          quotation_date: string
          quotation_number: string
          rfq_id: string | null
          status: Database["public"]["Enums"]["approval_decision"]
          supplier_id: string
          total_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          lead_time_days?: number | null
          organization_id: string
          payment_terms?: string | null
          quotation_date?: string
          quotation_number: string
          rfq_id?: string | null
          status?: Database["public"]["Enums"]["approval_decision"]
          supplier_id: string
          total_amount?: number
        }
        Update: {
          created_at?: string
          id?: string
          lead_time_days?: number | null
          organization_id?: string
          payment_terms?: string | null
          quotation_date?: string
          quotation_number?: string
          rfq_id?: string | null
          status?: Database["public"]["Enums"]["approval_decision"]
          supplier_id?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "supplier_quotations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_quotations_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_quotations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          code: string
          created_at: string
          email: string | null
          gstin: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          pan: string | null
          payment_terms_days: number
          phone: string | null
          rating: number | null
          supplier_type: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          email?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          pan?: string | null
          payment_terms_days?: number
          phone?: string | null
          rating?: number | null
          supplier_type?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          email?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          pan?: string | null
          payment_terms_days?: number
          phone?: string | null
          rating?: number | null
          supplier_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_codes: {
        Row: {
          cgst_percent: number
          code: string
          created_at: string
          id: string
          igst_percent: number
          is_active: boolean
          name: string
          organization_id: string
          rate_percent: number
          sgst_percent: number
        }
        Insert: {
          cgst_percent?: number
          code: string
          created_at?: string
          id?: string
          igst_percent?: number
          is_active?: boolean
          name: string
          organization_id: string
          rate_percent?: number
          sgst_percent?: number
        }
        Update: {
          cgst_percent?: number
          code?: string
          created_at?: string
          id?: string
          igst_percent?: number
          is_active?: boolean
          name?: string
          organization_id?: string
          rate_percent?: number
          sgst_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_codes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      transporters: {
        Row: {
          code: string
          contact_person: string | null
          created_at: string
          gstin: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          phone: string | null
          transporter_id: string | null
        }
        Insert: {
          code: string
          contact_person?: string | null
          created_at?: string
          gstin?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          phone?: string | null
          transporter_id?: string | null
        }
        Update: {
          code?: string
          contact_person?: string | null
          created_at?: string
          gstin?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          phone?: string | null
          transporter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transporters_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      uom_conversions: {
        Row: {
          created_at: string
          from_uom_id: string
          id: string
          multiplier: number
          organization_id: string
          to_uom_id: string
        }
        Insert: {
          created_at?: string
          from_uom_id: string
          id?: string
          multiplier: number
          organization_id: string
          to_uom_id: string
        }
        Update: {
          created_at?: string
          from_uom_id?: string
          id?: string
          multiplier?: number
          organization_id?: string
          to_uom_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uom_conversions_from_uom_id_fkey"
            columns: ["from_uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uom_conversions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uom_conversions_to_uom_id_fkey"
            columns: ["to_uom_id"]
            isOneToOne: false
            referencedRelation: "uoms"
            referencedColumns: ["id"]
          },
        ]
      }
      uoms: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          precision: number
          symbol: string | null
          uom_type: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          precision?: number
          symbol?: string | null
          uom_type?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          precision?: number
          symbol?: string | null
          uom_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "uoms_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_location_scopes: {
        Row: {
          can_read: boolean
          can_write: boolean
          created_at: string
          id: string
          location_id: string
          profile_id: string
        }
        Insert: {
          can_read?: boolean
          can_write?: boolean
          created_at?: string
          id?: string
          location_id: string
          profile_id: string
        }
        Update: {
          can_read?: boolean
          can_write?: boolean
          created_at?: string
          id?: string
          location_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_location_scopes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_location_scopes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          location_id: string
          name: string
          organization_id: string
          type: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          location_id: string
          name: string
          organization_id: string
          type?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          location_id?: string
          name?: string
          organization_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_document: {
        Args: {
          p_actor_id: string
          p_comments?: string
          p_decision: Database["public"]["Enums"]["approval_decision"]
          p_request_id: string
        }
        Returns: Json
      }
      confirm_sales_order: {
        Args: {
          p_actor_id: string
          p_idempotency_key: string
          p_order_id: string
        }
        Returns: Json
      }
      erp_document_action: {
        Args: {
          p_action: string
          p_id: string
          p_key: string
          p_payload: Json
          p_table: string
        }
        Returns: Json
      }
      erp_save_draft: {
        Args: { p_id?: string; p_table: string; p_values: Json }
        Returns: Json
      }
      get_document_connections: {
        Args: { p_doc_id: string; p_doc_type: string }
        Returns: Json
      }
      release_production_order: {
        Args: {
          p_actor_id: string
          p_idempotency_key: string
          p_order_id: string
        }
        Returns: Json
      }
      run_material_plan: {
        Args: {
          p_actor_id: string
          p_idempotency_key: string
          p_order_id: string
        }
        Returns: Json
      }
      submit_document: {
        Args: { p_actor_id: string; p_doc_id: string; p_doc_type: string }
        Returns: Json
      }
    }
    Enums: {
      approval_decision: "PENDING" | "APPROVED" | "REJECTED" | "RETURNED"
      document_status:
        | "DRAFT"
        | "SUBMITTED"
        | "PENDING_APPROVAL"
        | "APPROVED"
        | "POSTED"
        | "PARTIALLY_CLOSED"
        | "CLOSED"
        | "REJECTED"
        | "ON_HOLD"
        | "CANCELLED"
        | "REWORK"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      approval_decision: ["PENDING", "APPROVED", "REJECTED", "RETURNED"],
      document_status: [
        "DRAFT",
        "SUBMITTED",
        "PENDING_APPROVAL",
        "APPROVED",
        "POSTED",
        "PARTIALLY_CLOSED",
        "CLOSED",
        "REJECTED",
        "ON_HOLD",
        "CANCELLED",
        "REWORK",
      ],
    },
  },
} as const
