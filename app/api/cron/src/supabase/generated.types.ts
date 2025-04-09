export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null;
          month: string;
          month_fees: number | null;
          month_profit: number | null;
          month_sales: number | null;
          updated_at: string | null;
          year: string;
          ytd_fees: number | null;
          ytd_profit: number | null;
          ytd_sales: number | null;
        };
        Insert: {
          created_at?: string | null;
          month: string;
          month_fees?: number | null;
          month_profit?: number | null;
          month_sales?: number | null;
          updated_at?: string | null;
          year: string;
          ytd_fees?: number | null;
          ytd_profit?: number | null;
          ytd_sales?: number | null;
        };
        Update: {
          created_at?: string | null;
          month?: string;
          month_fees?: number | null;
          month_profit?: number | null;
          month_sales?: number | null;
          updated_at?: string | null;
          year?: string;
          ytd_fees?: number | null;
          ytd_profit?: number | null;
          ytd_sales?: number | null;
        };
        Relationships: [];
      };
      committee_members: {
        Row: {
          active: boolean | null;
          committee_id: number | null;
          end_date: string | null;
          id: number;
          member_id: number | null;
          notes: string | null;
          position: string | null;
          start_date: string | null;
        };
        Insert: {
          active?: boolean | null;
          committee_id?: number | null;
          end_date?: string | null;
          id?: number;
          member_id?: number | null;
          notes?: string | null;
          position?: string | null;
          start_date?: string | null;
        };
        Update: {
          active?: boolean | null;
          committee_id?: number | null;
          end_date?: string | null;
          id?: number;
          member_id?: number | null;
          notes?: string | null;
          position?: string | null;
          start_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "committee_members_committee_id_fkey";
            columns: ["committee_id"];
            isOneToOne: false;
            referencedRelation: "committees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "committee_members_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      committees: {
        Row: {
          committee_name: string | null;
          id: number;
        };
        Insert: {
          committee_name?: string | null;
          id?: number;
        };
        Update: {
          committee_name?: string | null;
          id?: number;
        };
        Relationships: [];
      };
      "Dev.Leftover.alembic_version (legacy)": {
        Row: {
          version_num: string;
        };
        Insert: {
          version_num: string;
        };
        Update: {
          version_num?: string;
        };
        Relationships: [];
      };
      "Dev.Leftover.Test (legacy)": {
        Row: {
          "Check #": number | null;
          ChkNo: string | null;
          City: string | null;
          Communications: string | null;
          ContactInfoNotOnWeb: string | null;
          CoordinatorCurriculum: string | null;
          Curriculum: string | null;
          "Date Received": string | null;
          DOB: string | null;
          Donation: string | null;
          email: string | null;
          Email: string | null;
          Finance: string | null;
          FirstName: string | null;
          Forum: string | null;
          Gndr: string | null;
          ID: string;
          Joined: string | null;
          LastName: string | null;
          Membership: string | null;
          New: string | null;
          Newsletter: string | null;
          "No.": number | null;
          OfficeMgr: string | null;
          "OLLI #": string | null;
          "Orient.": string | null;
          Outreach: string | null;
          Paid: string | null;
          Phone: string | null;
          Registrar: string | null;
          Renewed: string | null;
          State: string | null;
          Street: string | null;
          Supplies: string | null;
          Technology: string | null;
          USPS: string | null;
          "Web?": string | null;
          Website: string | null;
          ZipCode: string | null;
        };
        Insert: {
          "Check #"?: number | null;
          ChkNo?: string | null;
          City?: string | null;
          Communications?: string | null;
          ContactInfoNotOnWeb?: string | null;
          CoordinatorCurriculum?: string | null;
          Curriculum?: string | null;
          "Date Received"?: string | null;
          DOB?: string | null;
          Donation?: string | null;
          email?: string | null;
          Email?: string | null;
          Finance?: string | null;
          FirstName?: string | null;
          Forum?: string | null;
          Gndr?: string | null;
          ID: string;
          Joined?: string | null;
          LastName?: string | null;
          Membership?: string | null;
          New?: string | null;
          Newsletter?: string | null;
          "No."?: number | null;
          OfficeMgr?: string | null;
          "OLLI #"?: string | null;
          "Orient."?: string | null;
          Outreach?: string | null;
          Paid?: string | null;
          Phone?: string | null;
          Registrar?: string | null;
          Renewed?: string | null;
          State?: string | null;
          Street?: string | null;
          Supplies?: string | null;
          Technology?: string | null;
          USPS?: string | null;
          "Web?"?: string | null;
          Website?: string | null;
          ZipCode?: string | null;
        };
        Update: {
          "Check #"?: number | null;
          ChkNo?: string | null;
          City?: string | null;
          Communications?: string | null;
          ContactInfoNotOnWeb?: string | null;
          CoordinatorCurriculum?: string | null;
          Curriculum?: string | null;
          "Date Received"?: string | null;
          DOB?: string | null;
          Donation?: string | null;
          email?: string | null;
          Email?: string | null;
          Finance?: string | null;
          FirstName?: string | null;
          Forum?: string | null;
          Gndr?: string | null;
          ID?: string;
          Joined?: string | null;
          LastName?: string | null;
          Membership?: string | null;
          New?: string | null;
          Newsletter?: string | null;
          "No."?: number | null;
          OfficeMgr?: string | null;
          "OLLI #"?: string | null;
          "Orient."?: string | null;
          Outreach?: string | null;
          Paid?: string | null;
          Phone?: string | null;
          Registrar?: string | null;
          Renewed?: string | null;
          State?: string | null;
          Street?: string | null;
          Supplies?: string | null;
          Technology?: string | null;
          USPS?: string | null;
          "Web?"?: string | null;
          Website?: string | null;
          ZipCode?: string | null;
        };
        Relationships: [];
      };
      "Dev.Leftover.Test.k (legacy)": {
        Row: {
          "Check-Num": string | null;
          ChkNo: string | null;
          City: string | null;
          Communications: string | null;
          ContactInfoNotOnWeb: string | null;
          CoordinatorCurriculum: string | null;
          Curriculum: string | null;
          "Date Received": string | null;
          DOB: string | null;
          Donation: string | null;
          email: string;
          Email: string | null;
          Finance: string | null;
          FirstName: string | null;
          Forum: string | null;
          Gndr: string | null;
          Joined: string | null;
          LastName: string | null;
          LOA: string | null;
          Membership: string | null;
          New: string | null;
          Newsletter: string | null;
          No: number | null;
          OfficeMgr: string | null;
          "OLLI #": string | null;
          Orient: string | null;
          Outreach: string | null;
          Paid: string | null;
          Phone: string | null;
          Registrar: string | null;
          Renewed: string | null;
          State: string | null;
          Street: string | null;
          Supplies: string | null;
          Technology: string | null;
          USPS: string | null;
          Web: string | null;
          Website: string | null;
          ZipCode: string | null;
        };
        Insert: {
          "Check-Num"?: string | null;
          ChkNo?: string | null;
          City?: string | null;
          Communications?: string | null;
          ContactInfoNotOnWeb?: string | null;
          CoordinatorCurriculum?: string | null;
          Curriculum?: string | null;
          "Date Received"?: string | null;
          DOB?: string | null;
          Donation?: string | null;
          email: string;
          Email?: string | null;
          Finance?: string | null;
          FirstName?: string | null;
          Forum?: string | null;
          Gndr?: string | null;
          Joined?: string | null;
          LastName?: string | null;
          LOA?: string | null;
          Membership?: string | null;
          New?: string | null;
          Newsletter?: string | null;
          No?: number | null;
          OfficeMgr?: string | null;
          "OLLI #"?: string | null;
          Orient?: string | null;
          Outreach?: string | null;
          Paid?: string | null;
          Phone?: string | null;
          Registrar?: string | null;
          Renewed?: string | null;
          State?: string | null;
          Street?: string | null;
          Supplies?: string | null;
          Technology?: string | null;
          USPS?: string | null;
          Web?: string | null;
          Website?: string | null;
          ZipCode?: string | null;
        };
        Update: {
          "Check-Num"?: string | null;
          ChkNo?: string | null;
          City?: string | null;
          Communications?: string | null;
          ContactInfoNotOnWeb?: string | null;
          CoordinatorCurriculum?: string | null;
          Curriculum?: string | null;
          "Date Received"?: string | null;
          DOB?: string | null;
          Donation?: string | null;
          email?: string;
          Email?: string | null;
          Finance?: string | null;
          FirstName?: string | null;
          Forum?: string | null;
          Gndr?: string | null;
          Joined?: string | null;
          LastName?: string | null;
          LOA?: string | null;
          Membership?: string | null;
          New?: string | null;
          Newsletter?: string | null;
          No?: number | null;
          OfficeMgr?: string | null;
          "OLLI #"?: string | null;
          Orient?: string | null;
          Outreach?: string | null;
          Paid?: string | null;
          Phone?: string | null;
          Registrar?: string | null;
          Renewed?: string | null;
          State?: string | null;
          Street?: string | null;
          Supplies?: string | null;
          Technology?: string | null;
          USPS?: string | null;
          Web?: string | null;
          Website?: string | null;
          ZipCode?: string | null;
        };
        Relationships: [];
      };
      "Enrollment-24a (legacy)": {
        Row: {
          CreatedAt: string | null;
          EMail: string | null;
          FirstName: string | null;
          FriAM: string | null;
          Friend: string | null;
          FriPM: string | null;
          id: number;
          LastName: string;
          MonAM: string | null;
          MonPM: string | null;
          NumberSDGs: number | null;
          Phone: string | null;
          RequestComment: string | null;
          SDG1: string | null;
          SDG2: string | null;
          SDG3: string | null;
          SDG4: string | null;
          SDG5: string | null;
          SDG6: string | null;
          ThuAM: string | null;
          ThuPM: string | null;
          TueAM: string | null;
          TuePM: string | null;
          WedAM: string | null;
          WedPM: string | null;
          WHERE: string | null;
          WillCoordinate: string | null;
        };
        Insert: {
          CreatedAt?: string | null;
          EMail?: string | null;
          FirstName?: string | null;
          FriAM?: string | null;
          Friend?: string | null;
          FriPM?: string | null;
          id?: number;
          LastName: string;
          MonAM?: string | null;
          MonPM?: string | null;
          NumberSDGs?: number | null;
          Phone?: string | null;
          RequestComment?: string | null;
          SDG1?: string | null;
          SDG2?: string | null;
          SDG3?: string | null;
          SDG4?: string | null;
          SDG5?: string | null;
          SDG6?: string | null;
          ThuAM?: string | null;
          ThuPM?: string | null;
          TueAM?: string | null;
          TuePM?: string | null;
          WedAM?: string | null;
          WedPM?: string | null;
          WHERE?: string | null;
          WillCoordinate?: string | null;
        };
        Update: {
          CreatedAt?: string | null;
          EMail?: string | null;
          FirstName?: string | null;
          FriAM?: string | null;
          Friend?: string | null;
          FriPM?: string | null;
          id?: number;
          LastName?: string;
          MonAM?: string | null;
          MonPM?: string | null;
          NumberSDGs?: number | null;
          Phone?: string | null;
          RequestComment?: string | null;
          SDG1?: string | null;
          SDG2?: string | null;
          SDG3?: string | null;
          SDG4?: string | null;
          SDG5?: string | null;
          SDG6?: string | null;
          ThuAM?: string | null;
          ThuPM?: string | null;
          TueAM?: string | null;
          TuePM?: string | null;
          WedAM?: string | null;
          WedPM?: string | null;
          WHERE?: string | null;
          WillCoordinate?: string | null;
        };
        Relationships: [];
      };
      "Enrollment-24b (legacy)": {
        Row: {
          CreatedAt: string | null;
          EMail: string | null;
          FirstName: string | null;
          FriAM: string | null;
          Friend: string | null;
          FriPM: string | null;
          id: number;
          LastName: string;
          MonAM: string | null;
          MonPM: string | null;
          NumberSDGs: number | null;
          Phone: string | null;
          RequestComment: string | null;
          SDG1: string | null;
          SDG2: string | null;
          SDG3: string | null;
          SDG4: string | null;
          SDG5: string | null;
          SDG6: string | null;
          ThuAM: string | null;
          ThuPM: string | null;
          TueAM: string | null;
          TuePM: string | null;
          WedAM: string | null;
          WedPM: string | null;
          WHERE: string | null;
          WillCoordinate: string | null;
        };
        Insert: {
          CreatedAt?: string | null;
          EMail?: string | null;
          FirstName?: string | null;
          FriAM?: string | null;
          Friend?: string | null;
          FriPM?: string | null;
          id?: number;
          LastName: string;
          MonAM?: string | null;
          MonPM?: string | null;
          NumberSDGs?: number | null;
          Phone?: string | null;
          RequestComment?: string | null;
          SDG1?: string | null;
          SDG2?: string | null;
          SDG3?: string | null;
          SDG4?: string | null;
          SDG5?: string | null;
          SDG6?: string | null;
          ThuAM?: string | null;
          ThuPM?: string | null;
          TueAM?: string | null;
          TuePM?: string | null;
          WedAM?: string | null;
          WedPM?: string | null;
          WHERE?: string | null;
          WillCoordinate?: string | null;
        };
        Update: {
          CreatedAt?: string | null;
          EMail?: string | null;
          FirstName?: string | null;
          FriAM?: string | null;
          Friend?: string | null;
          FriPM?: string | null;
          id?: number;
          LastName?: string;
          MonAM?: string | null;
          MonPM?: string | null;
          NumberSDGs?: number | null;
          Phone?: string | null;
          RequestComment?: string | null;
          SDG1?: string | null;
          SDG2?: string | null;
          SDG3?: string | null;
          SDG4?: string | null;
          SDG5?: string | null;
          SDG6?: string | null;
          ThuAM?: string | null;
          ThuPM?: string | null;
          TueAM?: string | null;
          TuePM?: string | null;
          WedAM?: string | null;
          WedPM?: string | null;
          WHERE?: string | null;
          WillCoordinate?: string | null;
        };
        Relationships: [];
      };
      "Enrollment-24c (legacy)": {
        Row: {
          CreatedAt: string | null;
          EMail: string | null;
          FirstName: string | null;
          FriAM: string | null;
          Friend: string | null;
          FriPM: string | null;
          id: number;
          LastName: string;
          MonAM: string | null;
          MonPM: string | null;
          NumberSDGs: number | null;
          Phone: string | null;
          RequestComment: string | null;
          SDG1: string | null;
          SDG2: string | null;
          SDG3: string | null;
          SDG4: string | null;
          SDG5: string | null;
          SDG6: string | null;
          ThuAM: string | null;
          ThuPM: string | null;
          TueAM: string | null;
          TuePM: string | null;
          WedAM: string | null;
          WedPM: string | null;
          WHERE: string | null;
          WillCoordinate: string | null;
        };
        Insert: {
          CreatedAt?: string | null;
          EMail?: string | null;
          FirstName?: string | null;
          FriAM?: string | null;
          Friend?: string | null;
          FriPM?: string | null;
          id?: number;
          LastName: string;
          MonAM?: string | null;
          MonPM?: string | null;
          NumberSDGs?: number | null;
          Phone?: string | null;
          RequestComment?: string | null;
          SDG1?: string | null;
          SDG2?: string | null;
          SDG3?: string | null;
          SDG4?: string | null;
          SDG5?: string | null;
          SDG6?: string | null;
          ThuAM?: string | null;
          ThuPM?: string | null;
          TueAM?: string | null;
          TuePM?: string | null;
          WedAM?: string | null;
          WedPM?: string | null;
          WHERE?: string | null;
          WillCoordinate?: string | null;
        };
        Update: {
          CreatedAt?: string | null;
          EMail?: string | null;
          FirstName?: string | null;
          FriAM?: string | null;
          Friend?: string | null;
          FriPM?: string | null;
          id?: number;
          LastName?: string;
          MonAM?: string | null;
          MonPM?: string | null;
          NumberSDGs?: number | null;
          Phone?: string | null;
          RequestComment?: string | null;
          SDG1?: string | null;
          SDG2?: string | null;
          SDG3?: string | null;
          SDG4?: string | null;
          SDG5?: string | null;
          SDG6?: string | null;
          ThuAM?: string | null;
          ThuPM?: string | null;
          TueAM?: string | null;
          TuePM?: string | null;
          WedAM?: string | null;
          WedPM?: string | null;
          WHERE?: string | null;
          WillCoordinate?: string | null;
        };
        Relationships: [];
      };
      "Enrollment-25a (legacy)": {
        Row: {
          CreatedAt: string | null;
          EMail: string | null;
          FirstName: string | null;
          FriAM: string | null;
          Friend: string | null;
          FriPM: string | null;
          id: number;
          LastName: string | null;
          MonAM: number | null;
          MonPM: number | null;
          NumberSDGs: number | null;
          Phone: string | null;
          RequestComment: string | null;
          SDG1: string | null;
          SDG2: string | null;
          SDG3: string | null;
          SDG4: string | null;
          SDG5: string | null;
          SDG6: string | null;
          ThuAM: string | null;
          ThuPM: string | null;
          TueAM: number | null;
          TuePM: number | null;
          WedAM: number | null;
          WedPM: number | null;
          WHERE: string | null;
          WillCoordinate: string | null;
        };
        Insert: {
          CreatedAt?: string | null;
          EMail?: string | null;
          FirstName?: string | null;
          FriAM?: string | null;
          Friend?: string | null;
          FriPM?: string | null;
          id?: number;
          LastName?: string | null;
          MonAM?: number | null;
          MonPM?: number | null;
          NumberSDGs?: number | null;
          Phone?: string | null;
          RequestComment?: string | null;
          SDG1?: string | null;
          SDG2?: string | null;
          SDG3?: string | null;
          SDG4?: string | null;
          SDG5?: string | null;
          SDG6?: string | null;
          ThuAM?: string | null;
          ThuPM?: string | null;
          TueAM?: number | null;
          TuePM?: number | null;
          WedAM?: number | null;
          WedPM?: number | null;
          WHERE?: string | null;
          WillCoordinate?: string | null;
        };
        Update: {
          CreatedAt?: string | null;
          EMail?: string | null;
          FirstName?: string | null;
          FriAM?: string | null;
          Friend?: string | null;
          FriPM?: string | null;
          id?: number;
          LastName?: string | null;
          MonAM?: number | null;
          MonPM?: number | null;
          NumberSDGs?: number | null;
          Phone?: string | null;
          RequestComment?: string | null;
          SDG1?: string | null;
          SDG2?: string | null;
          SDG3?: string | null;
          SDG4?: string | null;
          SDG5?: string | null;
          SDG6?: string | null;
          ThuAM?: string | null;
          ThuPM?: string | null;
          TueAM?: number | null;
          TuePM?: number | null;
          WedAM?: number | null;
          WedPM?: number | null;
          WHERE?: string | null;
          WillCoordinate?: string | null;
        };
        Relationships: [];
      };
      "Enrollment-TEMPLATE (legacy)": {
        Row: {
          CreatedAt: string | null;
          EMail: string | null;
          FirstName: string | null;
          FriAM: number | null;
          Friend: string | null;
          FriPM: number | null;
          id: number;
          LastName: string | null;
          MonAM: number | null;
          MonPM: number | null;
          NumberSDGs: number | null;
          Phone: string | null;
          RequestComment: string | null;
          SDG1: string | null;
          SDG2: string | null;
          SDG3: string | null;
          SDG4: string | null;
          SDG5: string | null;
          SDG6: string | null;
          ThuAM: number | null;
          ThuPM: number | null;
          TueAM: number | null;
          TuePM: number | null;
          WedAM: number | null;
          WedPM: string | null;
          WillCoordinate: string | null;
        };
        Insert: {
          CreatedAt?: string | null;
          EMail?: string | null;
          FirstName?: string | null;
          FriAM?: number | null;
          Friend?: string | null;
          FriPM?: number | null;
          id?: number;
          LastName?: string | null;
          MonAM?: number | null;
          MonPM?: number | null;
          NumberSDGs?: number | null;
          Phone?: string | null;
          RequestComment?: string | null;
          SDG1?: string | null;
          SDG2?: string | null;
          SDG3?: string | null;
          SDG4?: string | null;
          SDG5?: string | null;
          SDG6?: string | null;
          ThuAM?: number | null;
          ThuPM?: number | null;
          TueAM?: number | null;
          TuePM?: number | null;
          WedAM?: number | null;
          WedPM?: string | null;
          WillCoordinate?: string | null;
        };
        Update: {
          CreatedAt?: string | null;
          EMail?: string | null;
          FirstName?: string | null;
          FriAM?: number | null;
          Friend?: string | null;
          FriPM?: number | null;
          id?: number;
          LastName?: string | null;
          MonAM?: number | null;
          MonPM?: number | null;
          NumberSDGs?: number | null;
          Phone?: string | null;
          RequestComment?: string | null;
          SDG1?: string | null;
          SDG2?: string | null;
          SDG3?: string | null;
          SDG4?: string | null;
          SDG5?: string | null;
          SDG6?: string | null;
          ThuAM?: number | null;
          ThuPM?: number | null;
          TueAM?: number | null;
          TuePM?: number | null;
          WedAM?: number | null;
          WedPM?: string | null;
          WillCoordinate?: string | null;
        };
        Relationships: [];
      };
      forums: {
        Row: {
          available_spots: number | null;
          date: string | null;
          description: string | null;
          id: number;
          product_id: number;
        };
        Insert: {
          available_spots?: number | null;
          date?: string | null;
          description?: string | null;
          id?: number;
          product_id: number;
        };
        Update: {
          available_spots?: number | null;
          date?: string | null;
          description?: string | null;
          id?: number;
          product_id?: number;
        };
        Relationships: [];
      };
      last_updated: {
        Row: {
          last_sync: string;
          table_name: string;
        };
        Insert: {
          last_sync: string;
          table_name: string;
        };
        Update: {
          last_sync?: string;
          table_name?: string;
        };
        Relationships: [];
      };
      leadership: {
        Row: {
          end_date: string | null;
          id: number;
          leadership_position_id: number | null;
          member_id: number | null;
          start_date: string | null;
        };
        Insert: {
          end_date?: string | null;
          id?: number;
          leadership_position_id?: number | null;
          member_id?: number | null;
          start_date?: string | null;
        };
        Update: {
          end_date?: string | null;
          id?: number;
          leadership_position_id?: number | null;
          member_id?: number | null;
          start_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leadership_leadership_position_id_fkey";
            columns: ["leadership_position_id"];
            isOneToOne: false;
            referencedRelation: "leadership_positions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leadership_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      leadership_positions: {
        Row: {
          id: number;
          leadership_position: string;
        };
        Insert: {
          id?: number;
          leadership_position: string;
        };
        Update: {
          id?: number;
          leadership_position?: string;
        };
        Relationships: [];
      };
      mail_orders: {
        Row: {
          member_id: number | null;
          order_date: string;
          order_id: number;
          order_status: string | null;
          shipping_address: string;
        };
        Insert: {
          member_id?: number | null;
          order_date: string;
          order_id?: number;
          order_status?: string | null;
          shipping_address: string;
        };
        Update: {
          member_id?: number | null;
          order_date?: string;
          order_id?: number;
          order_status?: string | null;
          shipping_address?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mail_orders_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      member_conflicts: {
        Row: {
          created_at: string;
          first_member_id: number;
          resolved: boolean;
          second_member_id: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          first_member_id?: number;
          resolved?: boolean;
          second_member_id: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          first_member_id?: number;
          resolved?: boolean;
          second_member_id?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "member_conflicts_first_member_id_fkey";
            columns: ["first_member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "member_conflicts_second_member_id_fkey";
            columns: ["second_member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      members: {
        Row: {
          alias: string | null;
          city: string | null;
          created_at: string;
          date_joined: string | null;
          date_of_birth: string | null;
          deceased_date: string | null;
          email: string | null;
          emergency_contact: string | null;
          emergency_contact_phone: string | null;
          expiration_date: string | null;
          first_name: string;
          gender: string | null;
          id: number;
          last_name: string;
          member_status: string | null;
          notes: string | null;
          orientation_date: string | null;
          partner: string | null;
          phone: string | null;
          photo_link: string | null;
          photo_path: string | null;
          public: boolean;
          state: string | null;
          street_address: string | null;
          type: Database["public"]["Enums"]["MemberStatus"];
          updated_at: string;
          zip_code: string | null;
        };
        Insert: {
          alias?: string | null;
          city?: string | null;
          created_at?: string;
          date_joined?: string | null;
          date_of_birth?: string | null;
          deceased_date?: string | null;
          email?: string | null;
          emergency_contact?: string | null;
          emergency_contact_phone?: string | null;
          expiration_date?: string | null;
          first_name: string;
          gender?: string | null;
          id?: number;
          last_name: string;
          member_status?: string | null;
          notes?: string | null;
          orientation_date?: string | null;
          partner?: string | null;
          phone?: string | null;
          photo_link?: string | null;
          photo_path?: string | null;
          public?: boolean;
          state?: string | null;
          street_address?: string | null;
          type: Database["public"]["Enums"]["MemberStatus"];
          updated_at?: string;
          zip_code?: string | null;
        };
        Update: {
          alias?: string | null;
          city?: string | null;
          created_at?: string;
          date_joined?: string | null;
          date_of_birth?: string | null;
          deceased_date?: string | null;
          email?: string | null;
          emergency_contact?: string | null;
          emergency_contact_phone?: string | null;
          expiration_date?: string | null;
          first_name?: string;
          gender?: string | null;
          id?: number;
          last_name?: string;
          member_status?: string | null;
          notes?: string | null;
          orientation_date?: string | null;
          partner?: string | null;
          phone?: string | null;
          photo_link?: string | null;
          photo_path?: string | null;
          public?: boolean;
          state?: string | null;
          street_address?: string | null;
          type?: Database["public"]["Enums"]["MemberStatus"];
          updated_at?: string;
          zip_code?: string | null;
        };
        Relationships: [];
      };
      members_backup: {
        Row: {
          alias: string | null;
          city: string | null;
          created_at: string | null;
          date_joined: string | null;
          date_of_birth: string | null;
          deceased_date: string | null;
          email: string | null;
          emergency_contact: string | null;
          emergency_contact_phone: string | null;
          expiration_date: string | null;
          first_name: string | null;
          gender: string | null;
          id: number;
          last_name: string | null;
          member_pid: number | null;
          member_status: string | null;
          notes: string | null;
          orientation_date: string | null;
          partner: string | null;
          phone: string | null;
          photo_link: string | null;
          photo_path: string | null;
          public: boolean | null;
          state: string | null;
          street_address: string | null;
          updated_at: string | null;
          zip: string | null;
        };
        Insert: {
          alias?: string | null;
          city?: string | null;
          created_at?: string | null;
          date_joined?: string | null;
          date_of_birth?: string | null;
          deceased_date?: string | null;
          email?: string | null;
          emergency_contact?: string | null;
          emergency_contact_phone?: string | null;
          expiration_date?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: number;
          last_name?: string | null;
          member_pid?: number | null;
          member_status?: string | null;
          notes?: string | null;
          orientation_date?: string | null;
          partner?: string | null;
          phone?: string | null;
          photo_link?: string | null;
          photo_path?: string | null;
          public?: boolean | null;
          state?: string | null;
          street_address?: string | null;
          updated_at?: string | null;
          zip?: string | null;
        };
        Update: {
          alias?: string | null;
          city?: string | null;
          created_at?: string | null;
          date_joined?: string | null;
          date_of_birth?: string | null;
          deceased_date?: string | null;
          email?: string | null;
          emergency_contact?: string | null;
          emergency_contact_phone?: string | null;
          expiration_date?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: number;
          last_name?: string | null;
          member_pid?: number | null;
          member_status?: string | null;
          notes?: string | null;
          orientation_date?: string | null;
          partner?: string | null;
          phone?: string | null;
          photo_link?: string | null;
          photo_path?: string | null;
          public?: boolean | null;
          state?: string | null;
          street_address?: string | null;
          updated_at?: string | null;
          zip?: string | null;
        };
        Relationships: [];
      };
      "members_backup_3/1/25": {
        Row: {
          alias: string | null;
          city: string | null;
          created_at: string | null;
          date_joined: string | null;
          date_of_birth: string | null;
          deceased_date: string | null;
          email: string | null;
          emergency_contact: string | null;
          emergency_contact_phone: string | null;
          expiration_date: string | null;
          first_name: string | null;
          gender: string | null;
          id: number;
          last_name: string | null;
          member_status: string | null;
          notes: string | null;
          orientation_date: string | null;
          partner: string | null;
          phone: string | null;
          photo_link: string | null;
          photo_path: string | null;
          public: boolean | null;
          state: string | null;
          street_address: string | null;
          updated_at: string | null;
          zip: string | null;
        };
        Insert: {
          alias?: string | null;
          city?: string | null;
          created_at?: string | null;
          date_joined?: string | null;
          date_of_birth?: string | null;
          deceased_date?: string | null;
          email?: string | null;
          emergency_contact?: string | null;
          emergency_contact_phone?: string | null;
          expiration_date?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: number;
          last_name?: string | null;
          member_status?: string | null;
          notes?: string | null;
          orientation_date?: string | null;
          partner?: string | null;
          phone?: string | null;
          photo_link?: string | null;
          photo_path?: string | null;
          public?: boolean | null;
          state?: string | null;
          street_address?: string | null;
          updated_at?: string | null;
          zip?: string | null;
        };
        Update: {
          alias?: string | null;
          city?: string | null;
          created_at?: string | null;
          date_joined?: string | null;
          date_of_birth?: string | null;
          deceased_date?: string | null;
          email?: string | null;
          emergency_contact?: string | null;
          emergency_contact_phone?: string | null;
          expiration_date?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: number;
          last_name?: string | null;
          member_status?: string | null;
          notes?: string | null;
          orientation_date?: string | null;
          partner?: string | null;
          phone?: string | null;
          photo_link?: string | null;
          photo_path?: string | null;
          public?: boolean | null;
          state?: string | null;
          street_address?: string | null;
          updated_at?: string | null;
          zip?: string | null;
        };
        Relationships: [];
      };
      members_duplicate: {
        Row: {
          city: string | null;
          created_at: string | null;
          date_joined: string | null;
          date_of_birth: string | null;
          deceased_date: string | null;
          email: string | null;
          emergency_contact: string | null;
          emergency_contact_phone: string | null;
          expiration_date: string | null;
          first_name: string | null;
          gender: string | null;
          id: number;
          last_name: string | null;
          member_status: string | null;
          notes: string | null;
          orientation_date: string | null;
          partner: string | null;
          phone: string | null;
          photo_link: string | null;
          photo_path: string | null;
          public: boolean | null;
          state: string | null;
          street_address: string | null;
          updated_at: string | null;
          zip: string | null;
        };
        Insert: {
          city?: string | null;
          created_at?: string | null;
          date_joined?: string | null;
          date_of_birth?: string | null;
          deceased_date?: string | null;
          email?: string | null;
          emergency_contact?: string | null;
          emergency_contact_phone?: string | null;
          expiration_date?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: number;
          last_name?: string | null;
          member_status?: string | null;
          notes?: string | null;
          orientation_date?: string | null;
          partner?: string | null;
          phone?: string | null;
          photo_link?: string | null;
          photo_path?: string | null;
          public?: boolean | null;
          state?: string | null;
          street_address?: string | null;
          updated_at?: string | null;
          zip?: string | null;
        };
        Update: {
          city?: string | null;
          created_at?: string | null;
          date_joined?: string | null;
          date_of_birth?: string | null;
          deceased_date?: string | null;
          email?: string | null;
          emergency_contact?: string | null;
          emergency_contact_phone?: string | null;
          expiration_date?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: number;
          last_name?: string | null;
          member_status?: string | null;
          notes?: string | null;
          orientation_date?: string | null;
          partner?: string | null;
          phone?: string | null;
          photo_link?: string | null;
          photo_path?: string | null;
          public?: boolean | null;
          state?: string | null;
          street_address?: string | null;
          updated_at?: string | null;
          zip?: string | null;
        };
        Relationships: [];
      };
      members_to_transactions: {
        Row: {
          amount: number;
          line_item_index: number;
          member_id: number;
          sku: string;
          transaction_id: number;
        };
        Insert: {
          amount: number;
          line_item_index: number;
          member_id: number;
          sku: string;
          transaction_id: number;
        };
        Update: {
          amount?: number;
          line_item_index?: number;
          member_id?: number;
          sku?: string;
          transaction_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "member_to_transactions_sku_fkey";
            columns: ["sku"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["sku"];
          },
          {
            foreignKeyName: "member_to_transactions_transaction_id_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "members_to_transactions_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      "orders (legacy)": {
        Row: {
          amount: number | null;
          created_at: string | null;
          date: string | null;
          external_transaction_id: string | null;
          fee: number | null;
          payment_platform: string | null;
          skus: Json | null;
          sqsp_order_id: string | null;
          sqsp_transaction_id: string;
          updated_at: string | null;
          user_emails: Json | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string | null;
          date?: string | null;
          external_transaction_id?: string | null;
          fee?: number | null;
          payment_platform?: string | null;
          skus?: Json | null;
          sqsp_order_id?: string | null;
          sqsp_transaction_id: string;
          updated_at?: string | null;
          user_emails?: Json | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string | null;
          date?: string | null;
          external_transaction_id?: string | null;
          fee?: number | null;
          payment_platform?: string | null;
          skus?: Json | null;
          sqsp_order_id?: string | null;
          sqsp_transaction_id?: string;
          updated_at?: string | null;
          user_emails?: Json | null;
        };
        Relationships: [];
      };
      orders_backup: {
        Row: {
          amount: number;
          created_at: string | null;
          date: string;
          external_transaction_id: string;
          fee: number | null;
          payment_platform: Database["public"]["Enums"]["PaymentPlatform"];
          skus: string[];
          sqsp_order_id: string | null;
          sqsp_transaction_id: string;
          updated_at: string | null;
          user_amounts: number[] | null;
          user_emails: string[];
          user_names: string[] | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          date: string;
          external_transaction_id: string;
          fee?: number | null;
          payment_platform: Database["public"]["Enums"]["PaymentPlatform"];
          skus: string[];
          sqsp_order_id?: string | null;
          sqsp_transaction_id: string;
          updated_at?: string | null;
          user_amounts?: number[] | null;
          user_emails: string[];
          user_names?: string[] | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          date?: string;
          external_transaction_id?: string;
          fee?: number | null;
          payment_platform?: Database["public"]["Enums"]["PaymentPlatform"];
          skus?: string[];
          sqsp_order_id?: string | null;
          sqsp_transaction_id?: string;
          updated_at?: string | null;
          user_amounts?: number[] | null;
          user_emails?: string[];
          user_names?: string[] | null;
        };
        Relationships: [];
      };
      "orders_backup_2/22/25": {
        Row: {
          amount: number;
          created_at: string;
          date: string;
          external_transaction_id: string;
          fee: number | null;
          member_pid: number | null;
          payment_platform: Database["public"]["Enums"]["PaymentPlatform"];
          skus: string[];
          sqsp_order_id: string | null;
          sqsp_transaction_id: string;
          updated_at: string;
          user_amounts: number[] | null;
          user_emails: string[];
          user_names: string[] | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          date: string;
          external_transaction_id: string;
          fee?: number | null;
          member_pid?: number | null;
          payment_platform: Database["public"]["Enums"]["PaymentPlatform"];
          skus: string[];
          sqsp_order_id?: string | null;
          sqsp_transaction_id: string;
          updated_at?: string;
          user_amounts?: number[] | null;
          user_emails: string[];
          user_names?: string[] | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          date?: string;
          external_transaction_id?: string;
          fee?: number | null;
          member_pid?: number | null;
          payment_platform?: Database["public"]["Enums"]["PaymentPlatform"];
          skus?: string[];
          sqsp_order_id?: string | null;
          sqsp_transaction_id?: string;
          updated_at?: string;
          user_amounts?: number[] | null;
          user_emails?: string[];
          user_names?: string[] | null;
        };
        Relationships: [];
      };
      payouts: {
        Row: {
          amount: number;
          date: string;
          id: number;
          payment_platform: Database["public"]["Enums"]["PaymentPlatform"];
          payout_id: string;
          received: boolean;
          status: string;
        };
        Insert: {
          amount: number;
          date: string;
          id?: number;
          payment_platform: Database["public"]["Enums"]["PaymentPlatform"];
          payout_id: string;
          received?: boolean;
          status: string;
        };
        Update: {
          amount?: number;
          date?: string;
          id?: number;
          payment_platform?: Database["public"]["Enums"]["PaymentPlatform"];
          payout_id?: string;
          received?: boolean;
          status?: string;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          permission: string;
        };
        Insert: {
          permission: string;
        };
        Update: {
          permission?: string;
        };
        Relationships: [];
      };
      product_analytics: {
        Row: {
          created_at: string | null;
          description: string;
          month: string;
          month_fees: number | null;
          month_profit: number | null;
          month_sales: number | null;
          sku: string;
          updated_at: string | null;
          year: string;
          ytd_fees: number | null;
          ytd_profit: number | null;
          ytd_sales: number | null;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          month: string;
          month_fees?: number | null;
          month_profit?: number | null;
          month_sales?: number | null;
          sku: string;
          updated_at?: string | null;
          year: string;
          ytd_fees?: number | null;
          ytd_profit?: number | null;
          ytd_sales?: number | null;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          month?: string;
          month_fees?: number | null;
          month_profit?: number | null;
          month_sales?: number | null;
          sku?: string;
          updated_at?: string | null;
          year?: string;
          ytd_fees?: number | null;
          ytd_profit?: number | null;
          ytd_sales?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_product_analytics_sku_products";
            columns: ["sku"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["sku"];
          },
        ];
      };
      products: {
        Row: {
          created_at: string;
          descriptor: string;
          group_id: string | null;
          sku: string;
          sq_id: string | null;
          type: Database["public"]["Enums"]["ProductType"];
          updated_at: string;
          year: string | null;
        };
        Insert: {
          created_at?: string;
          descriptor: string;
          group_id?: string | null;
          sku: string;
          sq_id?: string | null;
          type?: Database["public"]["Enums"]["ProductType"];
          updated_at?: string;
          year?: string | null;
        };
        Update: {
          created_at?: string;
          descriptor?: string;
          group_id?: string | null;
          sku?: string;
          sq_id?: string | null;
          type?: Database["public"]["Enums"]["ProductType"];
          updated_at?: string;
          year?: string | null;
        };
        Relationships: [];
      };
      prospects: {
        Row: {
          date: string | null;
          id: number;
          notes: string | null;
          prospect_name: string;
          prospect_phone: string | null;
          referred_by_member_id: number | null;
          referred_by_phone: string | null;
        };
        Insert: {
          date?: string | null;
          id?: number;
          notes?: string | null;
          prospect_name: string;
          prospect_phone?: string | null;
          referred_by_member_id?: number | null;
          referred_by_phone?: string | null;
        };
        Update: {
          date?: string | null;
          id?: number;
          notes?: string | null;
          prospect_name?: string;
          prospect_phone?: string | null;
          referred_by_member_id?: number | null;
          referred_by_phone?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "prospects_referred_by_member_id_fkey";
            columns: ["referred_by_member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      role_permissions: {
        Row: {
          permission: string;
          role: string;
        };
        Insert: {
          permission: string;
          role: string;
        };
        Update: {
          permission?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_fkey";
            columns: ["permission"];
            isOneToOne: false;
            referencedRelation: "permissions";
            referencedColumns: ["permission"];
          },
          {
            foreignKeyName: "role_permissions_role_fkey";
            columns: ["role"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["role"];
          },
        ];
      };
      role_permissions_test: {
        Row: {
          can_create: boolean | null;
          can_delete: boolean | null;
          can_read: boolean | null;
          can_write: boolean | null;
          id: number;
          role_name: string;
          table_name: string;
        };
        Insert: {
          can_create?: boolean | null;
          can_delete?: boolean | null;
          can_read?: boolean | null;
          can_write?: boolean | null;
          id?: number;
          role_name: string;
          table_name: string;
        };
        Update: {
          can_create?: boolean | null;
          can_delete?: boolean | null;
          can_read?: boolean | null;
          can_write?: boolean | null;
          id?: number;
          role_name?: string;
          table_name?: string;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          role: string;
        };
        Insert: {
          role: string;
        };
        Update: {
          role?: string;
        };
        Relationships: [];
      };
      sdg_members: {
        Row: {
          id: number;
          member_id: number | null;
          sdg_id: number | null;
        };
        Insert: {
          id?: number;
          member_id?: number | null;
          sdg_id?: number | null;
        };
        Update: {
          id?: number;
          member_id?: number | null;
          sdg_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "sdg_members_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sdg_members_sdg_id_fkey";
            columns: ["sdg_id"];
            isOneToOne: false;
            referencedRelation: "sdgs";
            referencedColumns: ["id"];
          },
        ];
      };
      sdgs: {
        Row: {
          coordinator: number | null;
          description: string | null;
          id: number;
          sdg: string;
          trimester: string;
        };
        Insert: {
          coordinator?: number | null;
          description?: string | null;
          id?: number;
          sdg: string;
          trimester: string;
        };
        Update: {
          coordinator?: number | null;
          description?: string | null;
          id?: number;
          sdg?: string;
          trimester?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sdgs_coordinator_fkey";
            columns: ["coordinator"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      server_status: {
        Row: {
          ping_time: string;
          pinged: boolean | null;
          request_id: number;
        };
        Insert: {
          ping_time?: string;
          pinged?: boolean | null;
          request_id: number;
        };
        Update: {
          ping_time?: string;
          pinged?: boolean | null;
          request_id?: number;
        };
        Relationships: [];
      };
      "tracking (legacy)": {
        Row: {
          created_at: string | null;
          cursor: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          cursor: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          cursor?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: number;
          created_at: string;
          date: string;
          external_transaction_id: string | null;
          fee: number;
          fulfillment_status: Database["public"]["Enums"]["FulfillmentStatus"];
          id: number;
          issues: Json[];
          parsed_form_data: Json[];
          payment_platform: Database["public"]["Enums"]["PaymentPlatform"];
          raw_form_data: Json[];
          refunded_amount: number;
          skus: string[];
          sqsp_order_id: string | null;
          sqsp_transaction_id: string | null;
          transaction_email: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          date: string;
          external_transaction_id?: string | null;
          fee: number;
          fulfillment_status?: Database["public"]["Enums"]["FulfillmentStatus"];
          id?: number;
          issues?: Json[];
          parsed_form_data?: Json[];
          payment_platform: Database["public"]["Enums"]["PaymentPlatform"];
          raw_form_data?: Json[];
          refunded_amount: number;
          skus: string[];
          sqsp_order_id?: string | null;
          sqsp_transaction_id?: string | null;
          transaction_email: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          date?: string;
          external_transaction_id?: string | null;
          fee?: number;
          fulfillment_status?: Database["public"]["Enums"]["FulfillmentStatus"];
          id?: number;
          issues?: Json[];
          parsed_form_data?: Json[];
          payment_platform?: Database["public"]["Enums"]["PaymentPlatform"];
          raw_form_data?: Json[];
          refunded_amount?: number;
          skus?: string[];
          sqsp_order_id?: string | null;
          sqsp_transaction_id?: string | null;
          transaction_email?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_pictures: {
        Row: {
          id: number;
          picture_link: string | null;
          user_id: string;
        };
        Insert: {
          id?: number;
          picture_link?: string | null;
          user_id?: string;
        };
        Update: {
          id?: number;
          picture_link?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: number;
          role: string;
          user_id: string;
        };
        Insert: {
          id?: number;
          role: string;
          user_id: string;
        };
        Update: {
          id?: number;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_role_fkey";
            columns: ["role"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["role"];
          },
        ];
      };
      "users (legacy)": {
        Row: {
          address: string | null;
          created_at: string | null;
          date_expired: string | null;
          date_renewed: string | null;
          email: string | null;
          emergency_contact: string | null;
          emergency_contact_phone: string | null;
          first_joined: string | null;
          is_member: boolean | null;
          name: string | null;
          phone: string | null;
          pk: string;
          profile_pic: string | null;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string | null;
          date_expired?: string | null;
          date_renewed?: string | null;
          email?: string | null;
          emergency_contact?: string | null;
          emergency_contact_phone?: string | null;
          first_joined?: string | null;
          is_member?: boolean | null;
          name?: string | null;
          phone?: string | null;
          pk: string;
          profile_pic?: string | null;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string | null;
          date_expired?: string | null;
          date_renewed?: string | null;
          email?: string | null;
          emergency_contact?: string | null;
          emergency_contact_phone?: string | null;
          first_joined?: string | null;
          is_member?: boolean | null;
          name?: string | null;
          phone?: string | null;
          pk?: string;
          profile_pic?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      collect_ping_single_table: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      delete_member: {
        Args: { p_pid: number };
        Returns: undefined;
      };
      enqueue_ping_single_table: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      fetch_sgqsp_donations: {
        Args: { from_date: string; to_date: string };
        Returns: {
          created_at: string;
          amount: number;
          payment_platform: string;
          first_name: string;
          last_name: string;
          email: string;
          city: string;
          zip_code: string;
          state: string;
          phone: string;
        }[];
      };
      find_similar_members: {
        Args: {
          email_input: string;
          phone_input: string;
          first_name_input: string;
          last_name_input: string;
        };
        Returns: {
          alias: string | null;
          city: string | null;
          created_at: string;
          date_joined: string | null;
          date_of_birth: string | null;
          deceased_date: string | null;
          email: string | null;
          emergency_contact: string | null;
          emergency_contact_phone: string | null;
          expiration_date: string | null;
          first_name: string;
          gender: string | null;
          id: number;
          last_name: string;
          member_status: string | null;
          notes: string | null;
          orientation_date: string | null;
          partner: string | null;
          phone: string | null;
          photo_link: string | null;
          photo_path: string | null;
          public: boolean;
          state: string | null;
          street_address: string | null;
          type: Database["public"]["Enums"]["MemberStatus"];
          updated_at: string;
          zip_code: string | null;
        }[];
      };
      get_all_donors: {
        Args: Record<PropertyKey, never>;
        Returns: {
          member_id: number;
          first_name: string;
          last_name: string;
          street_address: string;
          city: string;
          state: string;
          zip_code: string;
          total_donation_amount: number;
        }[];
      };
      get_all_enum_values: {
        Args: Record<PropertyKey, never>;
        Returns: {
          enum_type: string;
          enum_value: string;
        }[];
      };
      get_committee_members_with_email: {
        Args: Record<PropertyKey, never>;
        Returns: {
          pid: number;
          user_email: string;
          role: string;
        }[];
      };
      get_current_user_permissions: {
        Args: Record<PropertyKey, never>;
        Returns: {
          permission: string;
        }[];
      };
      get_current_user_roles: {
        Args: Record<PropertyKey, never>;
        Returns: {
          role: string;
        }[];
      };
      get_donation_history: {
        Args: { start_date: string; end_date: string };
        Returns: {
          member_id: number;
          first_name: string;
          last_name: string;
          street_address: string;
          city: string;
          state: string;
          zip_code: string;
          donation_amount: number;
          donation_date: string;
        }[];
      };
      get_donation_transactions: {
        Args: Record<PropertyKey, never>;
        Returns: {
          member_id: number;
          first_name: string;
          last_name: string;
          street_address: string;
          city: string;
          state: string;
          zip_code: string;
          donation_date: string;
          donation_amount: number;
        }[];
      };
      get_donor_donation_details: {
        Args: Record<PropertyKey, never>;
        Returns: {
          member_id: number;
          first_name: string;
          last_name: string;
          amount: number;
          donation_date: string;
        }[];
      };
      get_donors_by_month: {
        Args: { p_year: number; p_month: number };
        Returns: {
          member_id: number;
          first_name: string;
          last_name: string;
          street_address: string;
          city: string;
          state: string;
          zip_code: string;
          total_donation_amount: number;
        }[];
      };
      get_enum_values: {
        Args: { enum_type: string };
        Returns: {
          enum_value: string;
        }[];
      };
      get_members_basic: {
        Args: Record<PropertyKey, never>;
        Returns: {
          pid: number;
          first_name: string;
          last_name: string;
          street_address: string;
          city: string;
          state: string;
          zip: string;
          phone: string;
          email: string;
        }[];
      };
      get_members_full: {
        Args: Record<PropertyKey, never>;
        Returns: {
          pid: number;
          first_name: string;
          last_name: string;
          street_address: string;
          city: string;
          state: string;
          zip: string;
          phone: string;
          email: string;
          emergency_contact: string;
          emergency_contact_phone: string;
          member_status: string;
          expiration_date: string;
          date_of_birth: string;
          deceased_date: string;
          public: boolean;
          orientation_date: string;
          date_joined: string;
          notes: string;
        }[];
      };
      get_normalized_member: {
        Args: {
          _first_name: string;
          _last_name: string;
          _email: string;
          _phone: string;
        };
        Returns: {
          alias: string | null;
          city: string | null;
          created_at: string;
          date_joined: string | null;
          date_of_birth: string | null;
          deceased_date: string | null;
          email: string | null;
          emergency_contact: string | null;
          emergency_contact_phone: string | null;
          expiration_date: string | null;
          first_name: string;
          gender: string | null;
          id: number;
          last_name: string;
          member_status: string | null;
          notes: string | null;
          orientation_date: string | null;
          partner: string | null;
          phone: string | null;
          photo_link: string | null;
          photo_path: string | null;
          public: boolean;
          state: string | null;
          street_address: string | null;
          type: Database["public"]["Enums"]["MemberStatus"];
          updated_at: string;
          zip_code: string | null;
        }[];
      };
      get_paypal_fee: {
        Args: { p_year: number; p_month: number };
        Returns: number;
      };
      get_paypal_gross: {
        Args: { p_year: number; p_month: number };
        Returns: number;
      };
      get_paypal_net: {
        Args: { p_year: number; p_month: number };
        Returns: number;
      };
      get_paypal_payout_total: {
        Args: { p_year: number; p_month: number };
        Returns: number;
      };
      get_primary_key: {
        Args: { table_name: string };
        Returns: {
          primary_key: string;
        }[];
      };
      get_squarespace_donors: {
        Args: Record<PropertyKey, never>;
        Returns: {
          member_id: number;
          first_name: string;
          last_name: string;
          street_address: string;
          city: string;
          state: string;
          zip_code: string;
          total_donation_amount: number;
        }[];
      };
      get_stripe_fee: {
        Args: { p_year: number; p_month: number };
        Returns: number;
      };
      get_stripe_gross: {
        Args: { p_year: number; p_month: number };
        Returns: number;
      };
      get_stripe_net: {
        Args: { p_year: number; p_month: number };
        Returns: number;
      };
      get_stripe_payout_total: {
        Args: { p_year: number; p_month: number };
        Returns: number;
      };
      get_table_columns: {
        Args: { table_name: string };
        Returns: {
          column_name: string;
          udt_name: string;
          is_nullable: boolean;
          is_autoincrement: boolean;
        }[];
      };
      get_table_schema: {
        Args: { table_name: string };
        Returns: {
          column_name: string;
          udt_name: string;
          is_nullable: boolean;
        }[];
      };
      get_total_fee_by_type: {
        Args: { p_type: string; p_year: number; p_month: number };
        Returns: number;
      };
      get_total_gross_by_type: {
        Args:
          | { p_type: string }
          | { p_type: string; p_year: number; p_month: number };
        Returns: number;
      };
      get_user_id_from_email: {
        Args: { p_email: string };
        Returns: string;
      };
      get_user_roles_with_email: {
        Args: Record<PropertyKey, never>;
        Returns: {
          pid: number;
          user_email: string;
          role: string;
        }[];
      };
      get_users_basic: {
        Args: Record<PropertyKey, never>;
        Returns: {
          name: string;
          email: string;
          id: string;
        }[];
      };
      gtrgm_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_options: {
        Args: { "": unknown };
        Returns: undefined;
      };
      gtrgm_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      has_permission: {
        Args: { p_permission: string };
        Returns: boolean;
      };
      populate_member_conflicts: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      remap_member_fk: {
        Args: { old_member_id: number; new_member_id: number };
        Returns: undefined;
      };
      resolve_member_conflict_merge: {
        Args: {
          p_first_member_id: number;
          p_second_member_id: number;
          p_merged_member: Json;
        };
        Returns: undefined;
      };
      set_limit: {
        Args: { "": number };
        Returns: number;
      };
      show_limit: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      show_trgm: {
        Args: { "": string };
        Returns: string[];
      };
      update_user: {
        Args: { p_user_id: string; p_name: string };
        Returns: undefined;
      };
      upsert_member: {
        Args: {
          p_pid: number;
          p_first_name: string;
          p_last_name: string;
          p_street_address: string;
          p_city: string;
          p_state: string;
          p_zip: string;
          p_phone: string;
          p_email: string;
          p_emergency_contact: string;
          p_emergency_contact_phone: string;
          p_member_status: string;
          p_expiration_date: string;
          p_date_of_birth: string;
          p_deceased_date: string;
          p_public: boolean;
          p_orientation_date: string;
          p_date_joined: string;
          p_notes: string;
        };
        Returns: undefined;
      };
      upsert_payouts: {
        Args: { _payouts: Json };
        Returns: {
          amount: number;
          date: string;
          id: number;
          payment_platform: Database["public"]["Enums"]["PaymentPlatform"];
          payout_id: string;
          received: boolean;
          status: string;
        }[];
      };
      upsert_products: {
        Args: { _products: Json };
        Returns: {
          created_at: string;
          descriptor: string;
          group_id: string | null;
          sku: string;
          sq_id: string | null;
          type: Database["public"]["Enums"]["ProductType"];
          updated_at: string;
          year: string | null;
        }[];
      };
    };
    Enums: {
      FulfillmentStatus: "PENDING" | "FULFILLED" | "CANCELED" | "UNKNOWN";
      MemberStatus: "MEMBER" | "NONMEMBER";
      PaymentPlatform: "STRIPE" | "PAYPAL" | "MAIL";
      ProductType: "MEMBERSHIP" | "FORUM" | "DONATION" | "UNKNOWN" | "HIDDEN";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      FulfillmentStatus: ["PENDING", "FULFILLED", "CANCELED", "UNKNOWN"],
      MemberStatus: ["MEMBER", "NONMEMBER"],
      PaymentPlatform: ["STRIPE", "PAYPAL", "MAIL"],
      ProductType: ["MEMBERSHIP", "FORUM", "DONATION", "UNKNOWN", "HIDDEN"],
    },
  },
} as const;
