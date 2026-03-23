// Generated from unis-agency-agents schema files
// Total domains: 5
// Total tables: 129
// Total columns: 1105
// Generated on: 2026-03-23T00:32:07.915Z

export interface SchemaColumn {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'timestamp' | 'binary';
  constraints: string[];
  nullable: boolean;
  defaultValue?: string | null;
}

export interface SchemaForeignKey {
  column: string;
  referencedTable: string;
  referencedColumn: string;
}

export interface SchemaIndex {
  name: string;
  columns: string[];
  unique: boolean;
}

export interface SchemaTable {
  name: string;
  domain: string;
  columns: SchemaColumn[];
  foreignKeys: SchemaForeignKey[];
  indexes: SchemaIndex[];
}

export interface DomainSchema {
  domain: string;
  filename: string;
  tables: SchemaTable[];
  metadata: {
    file: string;
    parsedAt: string;
    tablesCount: number;
  };
}

export const agencySchemas: DomainSchema[] = [
  {
    "domain": "BNP",
    "filename": "bnp",
    "tables": [
      {
        "name": "invoice_header",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ReferenceNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CustomerPONumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillToID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ShipToID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingPeriodStart",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingPeriodEnd",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TermID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceTotal",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Balance",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Tax",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Discount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FreightCharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "OtherCharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Status",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceTypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DueDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FacilityID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingRuleSetID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TMSOrderID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DepartmentID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ChartofAccountID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PaymentStatus",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SourceCode",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "invoice_details",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillToID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DocID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingCodeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DoneDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Qty",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UnitPrice",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Cost",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Adjustment",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SpecialBill",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceItemID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsActive",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FacilityID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingPeriodStart",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingPeriodEnd",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsCreditmemo",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LocationID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BaseCost",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FuelCost",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccCost",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "invoice_items",
        "domain": "BNP",
        "columns": [
          {
            "name": "InvoiceID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingCodeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Description",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UnitPrice",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Qty",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Amount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Adjustment",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Taxable",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsActive",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ExternalID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TeamID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LocationID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClassID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "invoice_items_account_item",
        "domain": "BNP",
        "columns": [
          {
            "name": "InvoiceItemID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountItemTypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountItemType",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountItemID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountItem",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Description",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UnitPrice",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Qty",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Amount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Taxable",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsActive",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DocID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BilltoID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BOL",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Container",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Reference",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PreviewStatus",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "preview_invoice_details",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillToID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DocID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingCodeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DoneDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Qty",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UnitPrice",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Cost",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Adjustment",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SpecialBill",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceItemID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsActive",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FacilityID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingPeriodStart",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingPeriodEnd",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsCreditmemo",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LocationID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "paymentbill_header",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DriverID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ReferenceNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "StatusID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TripID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "trip_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Description",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PaytoID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TransactionDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "GLPostingDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TermID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DueDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PayDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "quoteAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "additionalAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TotalAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PayAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BaseCurrencyID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TransactionCurrencyID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CalculateStatus",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CalculateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PostDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Station",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BatchId",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "paymentbill_details",
        "domain": "BNP",
        "columns": [
          {
            "name": "BillID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TripOrderID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Weights",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Pallets",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Pieces",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Mileages",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Revenue",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "quoteAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "quoteAmount_BaseCharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "quoteAmount_ACCCharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "quoteAmount_FSCCharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AdditionalAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PackageID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PackageNo",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ApproveAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ServiceCategory",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Zone",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "cashreceipt_receipt_info",
        "domain": "BNP",
        "columns": [
          {
            "name": "EntryID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ReceiptNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "StatusID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ReceiptAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ReceiptType",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CheckNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TransactionDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CurrencyID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UnappliedAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AppliedAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ApplyPostDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Reference",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BankID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ARChartAccountID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsActive",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Category",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PaymentMethodType",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TransactionFee",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Source",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_client",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Description",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClientShortName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClientCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Address01",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "City",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "State",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ZipCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Country",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Telephone",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ContactPerson",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Email",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FEIN",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "NumberPrefix",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PenaltyInterestRate",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FiscalYearID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ShowInSystem",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsValid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "OrganizationId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CorporationId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ParentId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_vendor",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Category",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountID",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorShortName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Description",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Address01",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "City",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "State",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ZipCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Country",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Telephone",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ContactPerson",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Email",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoicePayperiod",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AutoApprove",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillCategory",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreditLimit",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreditHold",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DefaultPaymentTerm",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TermID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AutoGenInvoice",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsActive",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CurrencyID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SubCategory",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorType",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorLevel",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ParentId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CorporationId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_vendor_billing_rule_sets",
        "domain": "BNP",
        "columns": [
          {
            "name": "BillingRuleID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SetName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PreOrLateBill",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AutoApprove",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoicePayperiod",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoicePayperiodDetail",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceAutoGenDelays",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsActive",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "GraceDays",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AnniversaryDays",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SplitCondition",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "GenInvoiceWhen",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TermID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "MinimumTotalAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsDefault",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceDeliveryMethod",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "RuleSetCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_billing_code",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BilltoID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingDesc",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingPrice",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsValid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingCodeCategoryID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ValueType",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "HasEditDesc",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountingItemID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountingItemTypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingCodeUOM",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingCodeName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SimplifiedDesc",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UomDescription",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_billing_code_versions",
        "domain": "BNP",
        "columns": [
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BilltoID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VersionNumber",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "EffectiveDateFrom",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "EffectiveDateEnd",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsValid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SortNo",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VersionName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Source",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_invoice_account_items",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceChargeTypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountItem",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Description",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountItemTypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UnitPrice",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Taxable",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "MarkUpRate",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsValid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountItemCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Category",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UOM",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillToID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ActionCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ValueType",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ChargeCode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TriggerPointID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AutoBillingForWMS",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Status",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsActivated",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Source",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Lastupdate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "bookkeeping_journal",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "JournalNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "StatusID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TransactionTypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ReversingDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PostingDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Memo",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "GenerateStatus",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LinkedJournalEntryID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ExternalID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DocumentDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillPaymentID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "bookkeeping_journal_details",
        "domain": "BNP",
        "columns": [
          {
            "name": "JournalID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Debit",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Credit",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DepartmentID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TeamID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LocationID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Memo",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsValid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LinkedJournalDetailID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ExternalID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClassID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "bookkeeping_chartof_accounts",
        "domain": "BNP",
        "columns": [
          {
            "name": "AccountNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SubAccountof",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccountTypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IncludeChildren",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Balance",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Debit_total",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Credit_total",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsValid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ExternalID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Eliminate",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "bank_transactions",
        "domain": "BNP",
        "columns": [
          {
            "name": "BankAccountId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BankAccount",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BankCheckNo",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PostingDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TransactionNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BankDebit",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BankCredit",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BankBalance",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BankDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BankDescription",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "StatusId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BankTransTypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsValid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClientId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SourceFileName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LinkedType",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LinkedNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LinkedId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "debt_workflow",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "WorkflowName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Rules",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "OpenBalance",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClosedBalance",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CustomerCounts",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsValid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "debt_task",
        "domain": "BNP",
        "columns": [
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SpecialAttentionRequired",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "NoteTip",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SpecialReasonID",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "MeetingNote",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "MeetingNoteTip",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "claim_main",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClaimNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClaimType",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClaimDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Status",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LocationID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClaimAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ApprovedAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ReferenceNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Description",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ContactEmail",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ContactName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Source",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Category",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Reason",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CMInvoiceID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InternalNotes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ApprovedBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ApprovedDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AssinedTo",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillVendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "GenerateType",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SubStatus",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CarrierClaimStatus",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "commission_line",
        "domain": "BNP",
        "columns": [
          {
            "name": "SalesRep",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UserID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UserName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClientName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CustomerID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CustomerName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SplitID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "StartDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "EndDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "StatusID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Active",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LocationValue",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ApprovedBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ApprovedByID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ApproveTime",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UserType",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreatedBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateTime",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UpdatedBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UpdateTime",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "fixedasset_info",
        "domain": "BNP",
        "columns": [
          {
            "name": "AssetID",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AssetName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AssetDescription",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Qty",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PurchasePrice",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CurrentBookValue",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Lifetime",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "MethodID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DepreciationStatus",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Location",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Department",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AssetStatus",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsValid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SerialNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PurchaseDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Supplier",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CumulativeDepreciation",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AssetCategory",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PutInServiceDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FixedAssetType",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "uploaded_tracking_number",
        "domain": "BNP",
        "columns": [
          {
            "name": "BatchNo",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsPreview",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LogID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceDetailID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDay",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "OrderID",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TrackingNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "WiseCost",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BNPByTrackingNumberCost",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CostDifference",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Remarks",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Status",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "lso_package",
        "domain": "BNP",
        "columns": [
          {
            "name": "ImportDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AirbillNo",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PickUpLocID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DestinationLocID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillToCustID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ServiceType",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PkgWeight",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Pieces",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DeclaredValue",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "RegCharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ServiceCharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TotalCharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PickupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DelivStatus",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DelivDateTime",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Zone",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Discount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ToCity",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ToState",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ToZip",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FromCity",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FromState",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FromZip",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsUsed",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceNo",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BatchNo",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DataSource",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TripID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "tms_order",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "order_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "pu",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "pro",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "billto_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "pickup_date",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "delivery_date",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "weights",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "pallets",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "pieces",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "po",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "shipper_name",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "shipper_city",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "shipper_state",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "consignee_name",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "consignee_city",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "consignee_state",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Revenue",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "quoteAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "order_stage",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ARStatus",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "sources",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "tms_trip",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "trip_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "origin_terminal",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "dest_terminal",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "start_date",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "complete_date",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Stops",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Weights",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Pallets",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Pieces",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Mileages",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "carrier_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "carriername",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "driver_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "UserID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "driver_name",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "quoteAmount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "trip_statusid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "trip_status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "DriverPayType",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "sources",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "SourceId",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastupDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "tms_carrier_inc",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CarrierName",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TMSCarrierID",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TMSOrderID",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TMS_Order_OrderID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TMSPROnumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CarrierProNumber",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "OrderShipDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "OrderDeliveryDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FromCity",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FromState",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ToCity",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ToState",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceTotalCharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Basecharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Fuelcharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Discount",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AccTotalCharge",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PaymentStatusID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CalculateStatus",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "AP_ID",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "task_group_stage",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "TripID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "trip_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LastUpdateBy",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "op_wise_receiving_report",
        "domain": "BNP",
        "columns": [
          {
            "name": "clientid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "importeddate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "importedby",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "company",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "facility",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "receiptid",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "receipttype",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "customer",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "carrier",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "reference",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "po",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "createtime",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "eta",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "appointmenttime",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "closetime",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "lastupdate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "op_wise_shipping_report",
        "domain": "BNP",
        "columns": [
          {
            "name": "clientid",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "importeddate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "importedby",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "company",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "facility",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "orderid",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ordertype",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "customer",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "carrier",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "reference",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "po",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "so",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "pro",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "createtime",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "shipdate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "closetime",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "lastupdate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "log_generate_invoice",
        "domain": "BNP",
        "columns": [
          {
            "name": "ClientID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BatchNo",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "VendorID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "FacilityID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "BillingRuleSetID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "RunDay",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "GenerateResult",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "GenerateFrom",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "GenerateEnd",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "Category",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "IsPreview",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PeriodStartDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "PeriodEndDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "GeneratedFrom",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "InvoiceTypeID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "RunStatus",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "LocationID",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateDate",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "CreateBy",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      }
    ],
    "metadata": {
      "file": "bnp_init_schema.py",
      "parsedAt": "2026-03-23T00:32:07.898Z",
      "tablesCount": 31
    }
  },
  {
    "domain": "FMS",
    "filename": "fms",
    "tables": [
      {
        "name": "company",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "terminal",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "location",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "customer",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_usr_user",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_usr_role",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_usr_user_role",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_ord_shipment_order",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_ord_master_order",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_ord_work_order",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_dpt_trip",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_dpt_task",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_dpt_stop",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "load_info",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "driver",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "tractor",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "equipment",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "order_invoice",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_dpt_ap",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_dpt_driver_pay",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "rate_type",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "workflow_instance",
        "domain": "FMS",
        "columns": [],
        "foreignKeys": [],
        "indexes": []
      }
    ],
    "metadata": {
      "file": "fms_init_schema.py",
      "parsedAt": "2026-03-23T00:32:07.902Z",
      "tablesCount": 22
    }
  },
  {
    "domain": "OMS",
    "filename": "oms",
    "tables": [],
    "metadata": {
      "file": "oms_init_schema.py",
      "parsedAt": "2026-03-23T00:32:07.902Z",
      "tablesCount": 0
    }
  },
  {
    "domain": "WMS",
    "filename": "wms",
    "tables": [
      {
        "name": "def_facility",
        "domain": "WMS",
        "columns": [
          {
            "name": "name",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "address",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "''"
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "'ACTIVE'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          },
          {
            "name": "updated_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_customer",
        "domain": "WMS",
        "columns": [
          {
            "name": "name",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "org_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "inbound_setting",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'{}'"
          },
          {
            "name": "outbound_setting",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'{}'"
          },
          {
            "name": "inventory_setting",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'{}'"
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "'ACTIVE'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_item",
        "domain": "WMS",
        "columns": [
          {
            "name": "sku",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "name",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "uom",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'EA'"
          },
          {
            "name": "weight",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0"
          },
          {
            "name": "barcode",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "''"
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "'ACTIVE'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": [
          {
            "name": "idx_item_barcode",
            "columns": [
              "tenant_id",
              "barcode"
            ],
            "unique": true
          }
        ]
      },
      {
        "name": "def_carrier",
        "domain": "WMS",
        "columns": [
          {
            "name": "name",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "scac",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_user_profile",
        "domain": "WMS",
        "columns": [
          {
            "name": "name",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "role",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'WORKER'"
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "history_worker_operation_log",
        "domain": "WMS",
        "columns": [
          {
            "name": "worker_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "operation",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "timestamp",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_team_labors",
        "domain": "WMS",
        "columns": [
          {
            "name": "team_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "worker_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_labor_shift_setting",
        "domain": "WMS",
        "columns": [
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "shift_name",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "start_time",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "end_time",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_virtual_location_group",
        "domain": "WMS",
        "columns": [
          {
            "name": "name",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_virtual_location_tag",
        "domain": "WMS",
        "columns": [
          {
            "name": "vlg_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "name",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "vlg_id",
            "referencedTable": "def_virtual_location_group",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "def_virtual_location_tag_location",
        "domain": "WMS",
        "columns": [
          {
            "name": "tag_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "location_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "tag_id",
            "referencedTable": "def_virtual_location_tag",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "def_customer_vlg_allocation",
        "domain": "WMS",
        "columns": [
          {
            "name": "customer_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "vlg_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "vlg_id",
            "referencedTable": "def_virtual_location_group",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "def_item_vlg",
        "domain": "WMS",
        "columns": [
          {
            "name": "item_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "vlg_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "vlg_id",
            "referencedTable": "def_virtual_location_group",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "def_item_group_vlg",
        "domain": "WMS",
        "columns": [
          {
            "name": "item_group_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "vlg_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "vlg_id",
            "referencedTable": "def_virtual_location_group",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "def_prioritize_vlg_outbound_setting",
        "domain": "WMS",
        "columns": [
          {
            "name": "vlg_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "priority",
            "type": "number",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "0"
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_location",
        "domain": "WMS",
        "columns": [
          {
            "name": "location_code",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "zone",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "capacity",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "100"
          },
          {
            "name": "current_qty",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0"
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          }
        ],
        "foreignKeys": [],
        "indexes": [
          {
            "name": "idx_location_zone",
            "columns": [
              "isolation_id",
              "zone"
            ],
            "unique": false
          }
        ]
      },
      {
        "name": "doc_appointment",
        "domain": "WMS",
        "columns": [
          {
            "name": "dock_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "start_time",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "end_time",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'SCHEDULED'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_dock_assign",
        "domain": "WMS",
        "columns": [
          {
            "name": "dock_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "receipt_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "load_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ASSIGNED'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_stage_location_assign",
        "domain": "WMS",
        "columns": [
          {
            "name": "location_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "usage_type",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_receipt",
        "domain": "WMS",
        "columns": [
          {
            "name": "customer_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_receipt_itemline",
        "domain": "WMS",
        "columns": [
          {
            "name": "receipt_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "item_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "expected_qty",
            "type": "number",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "received_qty",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0"
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'PENDING'"
          }
        ],
        "foreignKeys": [
          {
            "column": "receipt_id",
            "referencedTable": "doc_receipt",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_receive_dock_check_in_step",
        "domain": "WMS",
        "columns": [
          {
            "name": "receipt_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "dock_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'CHECKED_IN'"
          },
          {
            "name": "checked_in_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_receive_task",
        "domain": "WMS",
        "columns": [
          {
            "name": "receipt_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "worker_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_receipt_status_change",
        "domain": "WMS",
        "columns": [
          {
            "name": "receipt_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "new_status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "changed_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_putaway_task",
        "domain": "WMS",
        "columns": [
          {
            "name": "inventory_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "target_location_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          },
          {
            "name": "completed_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_put_away_suggested",
        "domain": "WMS",
        "columns": [
          {
            "name": "task_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "location_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "score",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0"
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_qc_task",
        "domain": "WMS",
        "columns": [
          {
            "name": "inventory_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "result",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "notes",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          },
          {
            "name": "completed_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_inventory",
        "domain": "WMS",
        "columns": [
          {
            "name": "item_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "lp_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "location_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "qty",
            "type": "number",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "0"
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "customer_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "lot",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'AVAILABLE'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          },
          {
            "name": "updated_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": [
          {
            "name": "idx_inventory_item",
            "columns": [
              "tenant_id",
              "item_id",
              "status"
            ],
            "unique": false
          },
          {
            "name": "idx_inventory_location",
            "columns": [
              "isolation_id",
              "location_id"
            ],
            "unique": false
          }
        ]
      },
      {
        "name": "doc_inventory_lock",
        "domain": "WMS",
        "columns": [
          {
            "name": "inventory_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "task_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "task_type",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "qty",
            "type": "number",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": [
          {
            "name": "idx_inv_lock_active",
            "columns": [
              "inventory_id",
              "tenant_id"
            ],
            "unique": true
          }
        ]
      },
      {
        "name": "doc_inventory_snapshot",
        "domain": "WMS",
        "columns": [
          {
            "name": "inventory_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "item_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "qty",
            "type": "number",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "location_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "snapshot_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_adjustment",
        "domain": "WMS",
        "columns": [
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "reason",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'APPROVED'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_adjustment_line",
        "domain": "WMS",
        "columns": [
          {
            "name": "adjustment_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "inventory_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "qty_change",
            "type": "number",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "adjustment_id",
            "referencedTable": "doc_adjustment",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_movement_task",
        "domain": "WMS",
        "columns": [
          {
            "name": "inventory_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "dest_location_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_replenishment_task",
        "domain": "WMS",
        "columns": [
          {
            "name": "source_inventory_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "dest_location_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "qty",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          },
          {
            "name": "completed_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_count_ticket",
        "domain": "WMS",
        "columns": [
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "scope",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_count_task",
        "domain": "WMS",
        "columns": [
          {
            "name": "ticket_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          }
        ],
        "foreignKeys": [
          {
            "column": "ticket_id",
            "referencedTable": "doc_count_ticket",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_count_task_line",
        "domain": "WMS",
        "columns": [
          {
            "name": "task_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "location_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "item_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "expected_qty",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0"
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "task_id",
            "referencedTable": "event_count_task",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_count_result",
        "domain": "WMS",
        "columns": [
          {
            "name": "task_line_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "actual_qty",
            "type": "number",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "variance",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0"
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "counted_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_customer_abc_config",
        "domain": "WMS",
        "columns": [
          {
            "name": "customer_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "a_threshold",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0.8"
          },
          {
            "name": "b_threshold",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0.95"
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_order",
        "domain": "WMS",
        "columns": [
          {
            "name": "customer_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "'NEW'"
          },
          {
            "name": "cutoff_time",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          },
          {
            "name": "updated_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_order_itemline",
        "domain": "WMS",
        "columns": [
          {
            "name": "order_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "item_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "qty",
            "type": "number",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'PENDING'"
          }
        ],
        "foreignKeys": [
          {
            "column": "order_id",
            "referencedTable": "doc_order",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "doc_order_plan",
        "domain": "WMS",
        "columns": [
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "pick_type",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'DISCRETE'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_pick_strategy",
        "domain": "WMS",
        "columns": [
          {
            "name": "order_plan_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "pick_type",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "order_plan_id",
            "referencedTable": "doc_order_plan",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_pick_task",
        "domain": "WMS",
        "columns": [
          {
            "name": "order_plan_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_pick_itemline",
        "domain": "WMS",
        "columns": [
          {
            "name": "pick_task_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "order_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "item_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "qty",
            "type": "number",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "pick_task_id",
            "referencedTable": "event_pick_task",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_pick_step",
        "domain": "WMS",
        "columns": [
          {
            "name": "pick_task_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "location_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "item_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "qty_to_pick",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0"
          },
          {
            "name": "qty_picked",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0"
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "completed_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "pick_task_id",
            "referencedTable": "event_pick_task",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_pack_task",
        "domain": "WMS",
        "columns": [
          {
            "name": "pick_task_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "order_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ucc_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "completed_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_ucc",
        "domain": "WMS",
        "columns": [
          {
            "name": "order_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'PACKED'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_load",
        "domain": "WMS",
        "columns": [
          {
            "name": "carrier_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          },
          {
            "name": "shipped_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_load_orderline",
        "domain": "WMS",
        "columns": [
          {
            "name": "load_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "order_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "load_id",
            "referencedTable": "doc_load",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_load_task",
        "domain": "WMS",
        "columns": [
          {
            "name": "load_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_order_status_change",
        "domain": "WMS",
        "columns": [
          {
            "name": "order_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "new_status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "changed_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_small_parcel",
        "domain": "WMS",
        "columns": [
          {
            "name": "order_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "ucc_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "carrier_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tracking_no",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "shipped_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "doc_rma",
        "domain": "WMS",
        "columns": [
          {
            "name": "order_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "customer_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_robot",
        "domain": "WMS",
        "columns": [
          {
            "name": "name",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "zone_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "battery_level",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "100"
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'IDLE'"
          },
          {
            "name": "current_job_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "updated_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_equipment",
        "domain": "WMS",
        "columns": [
          {
            "name": "station_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "equipment_type",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ONLINE'"
          },
          {
            "name": "updated_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_station",
        "domain": "WMS",
        "columns": [
          {
            "name": "zone_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "station_type",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_container_info",
        "domain": "WMS",
        "columns": [
          {
            "name": "station_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'IDLE'"
          },
          {
            "name": "updated_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_map_info",
        "domain": "WMS",
        "columns": [
          {
            "name": "name",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "version",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "1"
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "def_map_zone",
        "domain": "WMS",
        "columns": [
          {
            "name": "map_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "name",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "map_id",
            "referencedTable": "def_map_info",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "def_map_location",
        "domain": "WMS",
        "columns": [
          {
            "name": "zone_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "x",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          }
        ],
        "foreignKeys": [
          {
            "column": "zone_id",
            "referencedTable": "def_map_zone",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_task",
        "domain": "WMS",
        "columns": [
          {
            "name": "wms_task_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "task_type",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "zone_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "event_job",
        "domain": "WMS",
        "columns": [
          {
            "name": "task_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "(datetime('now'"
          }
        ],
        "foreignKeys": [
          {
            "column": "task_id",
            "referencedTable": "event_task",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_step",
        "domain": "WMS",
        "columns": [
          {
            "name": "job_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "seq",
            "type": "number",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "action",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          }
        ],
        "foreignKeys": [
          {
            "column": "job_id",
            "referencedTable": "event_job",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      },
      {
        "name": "event_command",
        "domain": "WMS",
        "columns": [
          {
            "name": "step_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "device_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "command_type",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "tenant_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "isolation_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'NEW'"
          }
        ],
        "foreignKeys": [
          {
            "column": "step_id",
            "referencedTable": "event_step",
            "referencedColumn": "id"
          }
        ],
        "indexes": []
      }
    ],
    "metadata": {
      "file": "wms_init_schema.py",
      "parsedAt": "2026-03-23T00:32:07.912Z",
      "tablesCount": 65
    }
  },
  {
    "domain": "YMS",
    "filename": "yms",
    "tables": [
      {
        "name": "appointments",
        "domain": "YMS",
        "columns": [
          {
            "name": "status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "'PENDING'"
          },
          {
            "name": "equipment_type",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "scheduled_departure",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "entry_tickets",
        "domain": "YMS",
        "columns": [
          {
            "name": "status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "'CHECKED_IN'"
          },
          {
            "name": "carrier_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "equipment_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "drop_off_location_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "check_in_time",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "shuttle_tasks",
        "domain": "YMS",
        "columns": [
          {
            "name": "status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "'NEW'"
          },
          {
            "name": "from_location_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "prioritize",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "0"
          },
          {
            "name": "planned_start",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "yard_check_tasks",
        "domain": "YMS",
        "columns": [
          {
            "name": "status",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "'NEW'"
          },
          {
            "name": "assignee_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "equipment_status",
        "domain": "YMS",
        "columns": [
          {
            "name": "equipment_id",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "in_yard",
            "type": "number",
            "constraints": [],
            "nullable": true,
            "defaultValue": "1"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "locations",
        "domain": "YMS",
        "columns": [
          {
            "name": "name",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": "'AVAILABLE'"
          },
          {
            "name": "yard_activity",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "current_entry_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "1"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "carriers",
        "domain": "YMS",
        "columns": [
          {
            "name": "scac",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "drivers",
        "domain": "YMS",
        "columns": [
          {
            "name": "license_number",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "phone",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "customers",
        "domain": "YMS",
        "columns": [
          {
            "name": "yard_ids",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'ACTIVE'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "blacklist",
        "domain": "YMS",
        "columns": [
          {
            "name": "target_type",
            "type": "string",
            "constraints": [
              "NOT_NULL"
            ],
            "nullable": false,
            "defaultValue": null
          },
          {
            "name": "reason",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      },
      {
        "name": "waitlist_entries",
        "domain": "YMS",
        "columns": [
          {
            "name": "entry_id",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": null
          },
          {
            "name": "status",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "'WAITING'"
          },
          {
            "name": "created_at",
            "type": "string",
            "constraints": [],
            "nullable": true,
            "defaultValue": "CURRENT_TIMESTAMP"
          }
        ],
        "foreignKeys": [],
        "indexes": []
      }
    ],
    "metadata": {
      "file": "yms_init_schema.py",
      "parsedAt": "2026-03-23T00:32:07.913Z",
      "tablesCount": 11
    }
  }
];

export const schemaStats = {
  "domains": {
    "BNP": {
      "tables": 31,
      "columns": 712
    },
    "FMS": {
      "tables": 22,
      "columns": 0
    },
    "OMS": {
      "tables": 0,
      "columns": 0
    },
    "WMS": {
      "tables": 65,
      "columns": 355
    },
    "YMS": {
      "tables": 11,
      "columns": 38
    }
  },
  "totalTables": 129,
  "totalColumns": 1105
};

export const domainRelationships = {
  "BNP": {
    "invoice_header": {
      "referencedBy": [],
      "references": []
    },
    "invoice_details": {
      "referencedBy": [],
      "references": []
    },
    "invoice_items": {
      "referencedBy": [],
      "references": []
    },
    "invoice_items_account_item": {
      "referencedBy": [],
      "references": []
    },
    "preview_invoice_details": {
      "referencedBy": [],
      "references": []
    },
    "paymentbill_header": {
      "referencedBy": [],
      "references": []
    },
    "paymentbill_details": {
      "referencedBy": [],
      "references": []
    },
    "cashreceipt_receipt_info": {
      "referencedBy": [],
      "references": []
    },
    "def_client": {
      "referencedBy": [],
      "references": []
    },
    "def_vendor": {
      "referencedBy": [],
      "references": []
    },
    "def_vendor_billing_rule_sets": {
      "referencedBy": [],
      "references": []
    },
    "def_billing_code": {
      "referencedBy": [],
      "references": []
    },
    "def_billing_code_versions": {
      "referencedBy": [],
      "references": []
    },
    "def_invoice_account_items": {
      "referencedBy": [],
      "references": []
    },
    "bookkeeping_journal": {
      "referencedBy": [],
      "references": []
    },
    "bookkeeping_journal_details": {
      "referencedBy": [],
      "references": []
    },
    "bookkeeping_chartof_accounts": {
      "referencedBy": [],
      "references": []
    },
    "bank_transactions": {
      "referencedBy": [],
      "references": []
    },
    "debt_workflow": {
      "referencedBy": [],
      "references": []
    },
    "debt_task": {
      "referencedBy": [],
      "references": []
    },
    "claim_main": {
      "referencedBy": [],
      "references": []
    },
    "commission_line": {
      "referencedBy": [],
      "references": []
    },
    "fixedasset_info": {
      "referencedBy": [],
      "references": []
    },
    "uploaded_tracking_number": {
      "referencedBy": [],
      "references": []
    },
    "lso_package": {
      "referencedBy": [],
      "references": []
    },
    "tms_order": {
      "referencedBy": [],
      "references": []
    },
    "tms_trip": {
      "referencedBy": [],
      "references": []
    },
    "tms_carrier_inc": {
      "referencedBy": [],
      "references": []
    },
    "op_wise_receiving_report": {
      "referencedBy": [],
      "references": []
    },
    "op_wise_shipping_report": {
      "referencedBy": [],
      "references": []
    },
    "log_generate_invoice": {
      "referencedBy": [],
      "references": []
    }
  },
  "FMS": {
    "company": {
      "referencedBy": [],
      "references": []
    },
    "terminal": {
      "referencedBy": [],
      "references": []
    },
    "location": {
      "referencedBy": [],
      "references": []
    },
    "customer": {
      "referencedBy": [],
      "references": []
    },
    "def_usr_user": {
      "referencedBy": [],
      "references": []
    },
    "def_usr_role": {
      "referencedBy": [],
      "references": []
    },
    "def_usr_user_role": {
      "referencedBy": [],
      "references": []
    },
    "doc_ord_shipment_order": {
      "referencedBy": [],
      "references": []
    },
    "doc_ord_master_order": {
      "referencedBy": [],
      "references": []
    },
    "doc_ord_work_order": {
      "referencedBy": [],
      "references": []
    },
    "doc_dpt_trip": {
      "referencedBy": [],
      "references": []
    },
    "doc_dpt_task": {
      "referencedBy": [],
      "references": []
    },
    "doc_dpt_stop": {
      "referencedBy": [],
      "references": []
    },
    "load_info": {
      "referencedBy": [],
      "references": []
    },
    "driver": {
      "referencedBy": [],
      "references": []
    },
    "tractor": {
      "referencedBy": [],
      "references": []
    },
    "equipment": {
      "referencedBy": [],
      "references": []
    },
    "order_invoice": {
      "referencedBy": [],
      "references": []
    },
    "doc_dpt_ap": {
      "referencedBy": [],
      "references": []
    },
    "doc_dpt_driver_pay": {
      "referencedBy": [],
      "references": []
    },
    "rate_type": {
      "referencedBy": [],
      "references": []
    },
    "workflow_instance": {
      "referencedBy": [],
      "references": []
    }
  },
  "OMS": {},
  "WMS": {
    "def_facility": {
      "referencedBy": [],
      "references": []
    },
    "def_customer": {
      "referencedBy": [],
      "references": []
    },
    "def_item": {
      "referencedBy": [],
      "references": []
    },
    "def_carrier": {
      "referencedBy": [],
      "references": []
    },
    "doc_user_profile": {
      "referencedBy": [],
      "references": []
    },
    "history_worker_operation_log": {
      "referencedBy": [],
      "references": []
    },
    "def_team_labors": {
      "referencedBy": [],
      "references": []
    },
    "def_labor_shift_setting": {
      "referencedBy": [],
      "references": []
    },
    "def_virtual_location_group": {
      "referencedBy": [
        {
          "table": "def_virtual_location_tag",
          "domain": "WMS",
          "column": "vlg_id",
          "referencedColumn": "id"
        },
        {
          "table": "def_customer_vlg_allocation",
          "domain": "WMS",
          "column": "vlg_id",
          "referencedColumn": "id"
        },
        {
          "table": "def_item_vlg",
          "domain": "WMS",
          "column": "vlg_id",
          "referencedColumn": "id"
        },
        {
          "table": "def_item_group_vlg",
          "domain": "WMS",
          "column": "vlg_id",
          "referencedColumn": "id"
        }
      ],
      "references": []
    },
    "def_virtual_location_tag": {
      "referencedBy": [
        {
          "table": "def_virtual_location_tag_location",
          "domain": "WMS",
          "column": "tag_id",
          "referencedColumn": "id"
        }
      ],
      "references": [
        {
          "table": "def_virtual_location_group",
          "column": "vlg_id",
          "referencedColumn": "id"
        }
      ]
    },
    "def_virtual_location_tag_location": {
      "referencedBy": [],
      "references": [
        {
          "table": "def_virtual_location_tag",
          "column": "tag_id",
          "referencedColumn": "id"
        }
      ]
    },
    "def_customer_vlg_allocation": {
      "referencedBy": [],
      "references": [
        {
          "table": "def_virtual_location_group",
          "column": "vlg_id",
          "referencedColumn": "id"
        }
      ]
    },
    "def_item_vlg": {
      "referencedBy": [],
      "references": [
        {
          "table": "def_virtual_location_group",
          "column": "vlg_id",
          "referencedColumn": "id"
        }
      ]
    },
    "def_item_group_vlg": {
      "referencedBy": [],
      "references": [
        {
          "table": "def_virtual_location_group",
          "column": "vlg_id",
          "referencedColumn": "id"
        }
      ]
    },
    "def_prioritize_vlg_outbound_setting": {
      "referencedBy": [],
      "references": []
    },
    "doc_location": {
      "referencedBy": [],
      "references": []
    },
    "doc_appointment": {
      "referencedBy": [],
      "references": []
    },
    "def_dock_assign": {
      "referencedBy": [],
      "references": []
    },
    "def_stage_location_assign": {
      "referencedBy": [],
      "references": []
    },
    "doc_receipt": {
      "referencedBy": [
        {
          "table": "doc_receipt_itemline",
          "domain": "WMS",
          "column": "receipt_id",
          "referencedColumn": "id"
        }
      ],
      "references": []
    },
    "doc_receipt_itemline": {
      "referencedBy": [],
      "references": [
        {
          "table": "doc_receipt",
          "column": "receipt_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_receive_dock_check_in_step": {
      "referencedBy": [],
      "references": []
    },
    "event_receive_task": {
      "referencedBy": [],
      "references": []
    },
    "event_receipt_status_change": {
      "referencedBy": [],
      "references": []
    },
    "event_putaway_task": {
      "referencedBy": [],
      "references": []
    },
    "event_put_away_suggested": {
      "referencedBy": [],
      "references": []
    },
    "event_qc_task": {
      "referencedBy": [],
      "references": []
    },
    "doc_inventory": {
      "referencedBy": [],
      "references": []
    },
    "doc_inventory_lock": {
      "referencedBy": [],
      "references": []
    },
    "doc_inventory_snapshot": {
      "referencedBy": [],
      "references": []
    },
    "doc_adjustment": {
      "referencedBy": [
        {
          "table": "doc_adjustment_line",
          "domain": "WMS",
          "column": "adjustment_id",
          "referencedColumn": "id"
        }
      ],
      "references": []
    },
    "doc_adjustment_line": {
      "referencedBy": [],
      "references": [
        {
          "table": "doc_adjustment",
          "column": "adjustment_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_movement_task": {
      "referencedBy": [],
      "references": []
    },
    "event_replenishment_task": {
      "referencedBy": [],
      "references": []
    },
    "doc_count_ticket": {
      "referencedBy": [
        {
          "table": "event_count_task",
          "domain": "WMS",
          "column": "ticket_id",
          "referencedColumn": "id"
        }
      ],
      "references": []
    },
    "event_count_task": {
      "referencedBy": [
        {
          "table": "event_count_task_line",
          "domain": "WMS",
          "column": "task_id",
          "referencedColumn": "id"
        }
      ],
      "references": [
        {
          "table": "doc_count_ticket",
          "column": "ticket_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_count_task_line": {
      "referencedBy": [],
      "references": [
        {
          "table": "event_count_task",
          "column": "task_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_count_result": {
      "referencedBy": [],
      "references": []
    },
    "def_customer_abc_config": {
      "referencedBy": [],
      "references": []
    },
    "doc_order": {
      "referencedBy": [
        {
          "table": "doc_order_itemline",
          "domain": "WMS",
          "column": "order_id",
          "referencedColumn": "id"
        }
      ],
      "references": []
    },
    "doc_order_itemline": {
      "referencedBy": [],
      "references": [
        {
          "table": "doc_order",
          "column": "order_id",
          "referencedColumn": "id"
        }
      ]
    },
    "doc_order_plan": {
      "referencedBy": [
        {
          "table": "event_pick_strategy",
          "domain": "WMS",
          "column": "order_plan_id",
          "referencedColumn": "id"
        }
      ],
      "references": []
    },
    "event_pick_strategy": {
      "referencedBy": [],
      "references": [
        {
          "table": "doc_order_plan",
          "column": "order_plan_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_pick_task": {
      "referencedBy": [
        {
          "table": "event_pick_itemline",
          "domain": "WMS",
          "column": "pick_task_id",
          "referencedColumn": "id"
        },
        {
          "table": "event_pick_step",
          "domain": "WMS",
          "column": "pick_task_id",
          "referencedColumn": "id"
        }
      ],
      "references": []
    },
    "event_pick_itemline": {
      "referencedBy": [],
      "references": [
        {
          "table": "event_pick_task",
          "column": "pick_task_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_pick_step": {
      "referencedBy": [],
      "references": [
        {
          "table": "event_pick_task",
          "column": "pick_task_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_pack_task": {
      "referencedBy": [],
      "references": []
    },
    "doc_ucc": {
      "referencedBy": [],
      "references": []
    },
    "doc_load": {
      "referencedBy": [
        {
          "table": "doc_load_orderline",
          "domain": "WMS",
          "column": "load_id",
          "referencedColumn": "id"
        }
      ],
      "references": []
    },
    "doc_load_orderline": {
      "referencedBy": [],
      "references": [
        {
          "table": "doc_load",
          "column": "load_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_load_task": {
      "referencedBy": [],
      "references": []
    },
    "event_order_status_change": {
      "referencedBy": [],
      "references": []
    },
    "doc_small_parcel": {
      "referencedBy": [],
      "references": []
    },
    "doc_rma": {
      "referencedBy": [],
      "references": []
    },
    "def_robot": {
      "referencedBy": [],
      "references": []
    },
    "def_equipment": {
      "referencedBy": [],
      "references": []
    },
    "def_station": {
      "referencedBy": [],
      "references": []
    },
    "def_container_info": {
      "referencedBy": [],
      "references": []
    },
    "def_map_info": {
      "referencedBy": [
        {
          "table": "def_map_zone",
          "domain": "WMS",
          "column": "map_id",
          "referencedColumn": "id"
        }
      ],
      "references": []
    },
    "def_map_zone": {
      "referencedBy": [
        {
          "table": "def_map_location",
          "domain": "WMS",
          "column": "zone_id",
          "referencedColumn": "id"
        }
      ],
      "references": [
        {
          "table": "def_map_info",
          "column": "map_id",
          "referencedColumn": "id"
        }
      ]
    },
    "def_map_location": {
      "referencedBy": [],
      "references": [
        {
          "table": "def_map_zone",
          "column": "zone_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_task": {
      "referencedBy": [
        {
          "table": "event_job",
          "domain": "WMS",
          "column": "task_id",
          "referencedColumn": "id"
        }
      ],
      "references": []
    },
    "event_job": {
      "referencedBy": [
        {
          "table": "event_step",
          "domain": "WMS",
          "column": "job_id",
          "referencedColumn": "id"
        }
      ],
      "references": [
        {
          "table": "event_task",
          "column": "task_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_step": {
      "referencedBy": [
        {
          "table": "event_command",
          "domain": "WMS",
          "column": "step_id",
          "referencedColumn": "id"
        }
      ],
      "references": [
        {
          "table": "event_job",
          "column": "job_id",
          "referencedColumn": "id"
        }
      ]
    },
    "event_command": {
      "referencedBy": [],
      "references": [
        {
          "table": "event_step",
          "column": "step_id",
          "referencedColumn": "id"
        }
      ]
    }
  },
  "YMS": {
    "appointments": {
      "referencedBy": [],
      "references": []
    },
    "entry_tickets": {
      "referencedBy": [],
      "references": []
    },
    "shuttle_tasks": {
      "referencedBy": [],
      "references": []
    },
    "yard_check_tasks": {
      "referencedBy": [],
      "references": []
    },
    "equipment_status": {
      "referencedBy": [],
      "references": []
    },
    "locations": {
      "referencedBy": [],
      "references": []
    },
    "carriers": {
      "referencedBy": [],
      "references": []
    },
    "drivers": {
      "referencedBy": [],
      "references": []
    },
    "customers": {
      "referencedBy": [],
      "references": []
    },
    "blacklist": {
      "referencedBy": [],
      "references": []
    },
    "waitlist_entries": {
      "referencedBy": [],
      "references": []
    }
  }
};

// Helper functions
export function getTablesByDomain(domain: string): SchemaTable[] {
  const schema = agencySchemas.find(s => s.domain === domain);
  return schema ? schema.tables : [];
}

export function getTableByName(tableName: string): SchemaTable | undefined {
  for (const schema of agencySchemas) {
    const table = schema.tables.find(t => t.name === tableName);
    if (table) return table;
  }
  return undefined;
}

export function getRelatedTables(tableName: string): string[] {
  const related = new Set<string>();
  
  // Find tables that reference this table
  for (const schema of agencySchemas) {
    for (const table of schema.tables) {
      for (const fk of table.foreignKeys) {
        if (fk.referencedTable === tableName) {
          related.add(table.name);
        }
        if (table.name === tableName) {
          related.add(fk.referencedTable);
        }
      }
    }
  }
  
  return Array.from(related);
}

// Domain color mapping (matches agency-agents.ts)
export const DOMAIN_COLORS = {
  WMS: '#3B82F6',    // Blue
  OMS: '#10B981',    // Green
  FMS: '#F59E0B',    // Amber
  BNP: '#F59E0B',    // Amber
  YMS: '#8B5CF6'     // Purple
};
