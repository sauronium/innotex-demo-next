import { createClient } from "./client";
import { generateIdempotencyKey } from "../utils";

export interface DocumentConnectionsResult {
  document_type: string;
  document_id: string;
  upstream: Array<{
    type: string;
    id: string;
    link: string;
    created_at: string;
  }>;
  downstream: Array<{
    type: string;
    id: string;
    link: string;
    created_at: string;
  }>;
  audit: Array<{
    action: string;
    actor_id: string | null;
    changes: Record<string, unknown> | null;
    created_at: string;
  }>;
  attachments: Array<{
    id: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    created_at: string;
  }>;
}

/**
 * Execute a controlled ERP domain action (e.g. confirm, mrp, complete_operation, quality_decision, dispatch, post_invoice, receive_payment, approve, reject)
 */
export async function executeDocumentAction(params: {
  table: string;
  id: string;
  action: string;
  payload?: Record<string, unknown>;
  idempotencyKey?: string;
}): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const supabase = createClient();
  const key = params.idempotencyKey || generateIdempotencyKey(params.action);

  try {
    const { data, error } = await (supabase.rpc as any)("erp_document_action", {
      p_table: params.table,
      p_id: params.id,
      p_action: params.action,
      p_payload: (params.payload || {}) as unknown as import("./database.types").Json,
      p_key: key,
    });

    if (error) {
      console.warn("RPC erp_document_action warning:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Document action failed";
    console.warn("Exception in executeDocumentAction:", message);
    return { success: false, error: message };
  }
}

/**
 * Save or update a draft record in any editable ERP table
 */
export async function saveDocumentDraft(params: {
  table: string;
  values: Record<string, unknown>;
  id?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createClient();

  try {
    const { data, error } = await (supabase.rpc as any)("erp_save_draft", {
      p_table: params.table,
      p_values: params.values as unknown as import("./database.types").Json,
      p_id: params.id || null,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const res = data as { id?: string } | null;
    return { success: true, id: res?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Draft save failed";
    return { success: false, error: message };
  }
}

/**
 * Retrieve upstream/downstream document connections, audit events, and attachments
 */
export async function getDocumentConnections(
  documentType: string,
  documentId: string
): Promise<DocumentConnectionsResult | null> {
  const supabase = createClient();

  try {
    const { data, error } = await (supabase.rpc as any)("get_document_connections", {
      p_doc_type: documentType,
      p_doc_id: documentId,
    });

    if (error) {
      console.warn("get_document_connections RPC:", error.message);
      return null;
    }

    return data as unknown as DocumentConnectionsResult;
  } catch (err) {
    console.warn("Exception fetching document connections:", err);
    return null;
  }
}

/**
 * Trigger MRP explosion for a sales order
 */
export async function runMaterialPlan(orderId: string): Promise<{ success: boolean; planId?: string; error?: string }> {
  const supabase = createClient();

  try {
    const { data, error } = await (supabase.rpc as any)("run_material_plan", {
      p_order_id: orderId,
      p_actor_id: "00000000-0000-0000-0000-000000000005",
      p_idempotency_key: generateIdempotencyKey("mrp_plan"),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const res = data as { plan_id?: string } | null;
    return { success: true, planId: res?.plan_id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "MRP calculation failed";
    return { success: false, error: message };
  }
}

/**
 * Maker-checker approval or rejection
 */
export async function approveDocumentRequest(params: {
  requestId: string;
  decision: "APPROVED" | "REJECTED";
  actorId: string;
  comments?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const { data, error } = await (supabase.rpc as any)("approve_document", {
      p_request_id: params.requestId,
      p_decision: params.decision,
      p_actor_id: params.actorId,
      p_comments: params.comments || "",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, ...((data as object) || {}) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Approval failed";
    return { success: false, error: message };
  }
}
