export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null
          month: string
          month_fees: number | null
          month_profit: number | null
          month_sales: number | null
          updated_at: string | null
          year: string
          ytd_fees: number | null
          ytd_profit: number | null
          ytd_sales: number | null
        }
        Insert: {
          created_at?: string | null
          month: string
          month_fees?: number | null
          month_profit?: number | null
          month_sales?: number | null
          updated_at?: string | null
          year: string
          ytd_fees?: number | null
          ytd_profit?: number | null
          ytd_sales?: number | null
        }
        Update: {
          created_at?: string | null
          month?: string
          month_fees?: number | null
          month_profit?: number | null
          month_sales?: number | null
          updated_at?: string | null
          year?: string
          ytd_fees?: number | null
          ytd_profit?: number | null
          ytd_sales?: number | null
        }
        Relationships: []
      }
      committee_members: {
        Row: {
          active: boolean | null
          committee_id: number | null
          end_date: string | null
          id: number
          member_id: number | null
          notes: string | null
          position: string | null
          start_date: string | null
        }
        Insert: {
          active?: boolean | null
          committee_id?: number | null
          end_date?: string | null
          id?: number
          member_id?: number | null
          notes?: string | null
          position?: string | null
          start_date?: string | null
        }
        Update: {
          active?: boolean | null
          committee_id?: number | null
          end_date?: string | null
          id?: number
          member_id?: number | null
          notes?: string | null
          position?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "committee_members_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "committee_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["pid"]
          },
        ]
      }
      committees: {
        Row: {
          committee_name: string
          id: number
        }
        Insert: {
          committee_name: string
          id?: number
        }
        Update: {
          committee_name?: string
          id?: number
        }
        Relationships: []
      }
      "Dev.Leftover.alembic_version": {
        Row: {
          version_num: string
        }
        Insert: {
          version_num: string
        }
        Update: {
          version_num?: string
        }
        Relationships: []
      }
      "Dev.Leftover.Test": {
        Row: {
          "Check #": number | null
          ChkNo: string | null
          City: string | null
          Communications: string | null
          ContactInfoNotOnWeb: string | null
          CoordinatorCurriculum: string | null
          Curriculum: string | null
          "Date Received": string | null
          DOB: string | null
          Donation: string | null
          email: string | null
          Email: string | null
          Finance: string | null
          FirstName: string | null
          Forum: string | null
          Gndr: string | null
          ID: string
          Joined: string | null
          LastName: string | null
          Membership: string | null
          New: string | null
          Newsletter: string | null
          "No.": number | null
          OfficeMgr: string | null
          "OLLI #": string | null
          "Orient.": string | null
          Outreach: string | null
          Paid: string | null
          Phone: string | null
          Registrar: string | null
          Renewed: string | null
          State: string | null
          Street: string | null
          Supplies: string | null
          Technology: string | null
          USPS: string | null
          "Web?": string | null
          Website: string | null
          ZipCode: string | null
        }
        Insert: {
          "Check #"?: number | null
          ChkNo?: string | null
          City?: string | null
          Communications?: string | null
          ContactInfoNotOnWeb?: string | null
          CoordinatorCurriculum?: string | null
          Curriculum?: string | null
          "Date Received"?: string | null
          DOB?: string | null
          Donation?: string | null
          email?: string | null
          Email?: string | null
          Finance?: string | null
          FirstName?: string | null
          Forum?: string | null
          Gndr?: string | null
          ID: string
          Joined?: string | null
          LastName?: string | null
          Membership?: string | null
          New?: string | null
          Newsletter?: string | null
          "No."?: number | null
          OfficeMgr?: string | null
          "OLLI #"?: string | null
          "Orient."?: string | null
          Outreach?: string | null
          Paid?: string | null
          Phone?: string | null
          Registrar?: string | null
          Renewed?: string | null
          State?: string | null
          Street?: string | null
          Supplies?: string | null
          Technology?: string | null
          USPS?: string | null
          "Web?"?: string | null
          Website?: string | null
          ZipCode?: string | null
        }
        Update: {
          "Check #"?: number | null
          ChkNo?: string | null
          City?: string | null
          Communications?: string | null
          ContactInfoNotOnWeb?: string | null
          CoordinatorCurriculum?: string | null
          Curriculum?: string | null
          "Date Received"?: string | null
          DOB?: string | null
          Donation?: string | null
          email?: string | null
          Email?: string | null
          Finance?: string | null
          FirstName?: string | null
          Forum?: string | null
          Gndr?: string | null
          ID?: string
          Joined?: string | null
          LastName?: string | null
          Membership?: string | null
          New?: string | null
          Newsletter?: string | null
          "No."?: number | null
          OfficeMgr?: string | null
          "OLLI #"?: string | null
          "Orient."?: string | null
          Outreach?: string | null
          Paid?: string | null
          Phone?: string | null
          Registrar?: string | null
          Renewed?: string | null
          State?: string | null
          Street?: string | null
          Supplies?: string | null
          Technology?: string | null
          USPS?: string | null
          "Web?"?: string | null
          Website?: string | null
          ZipCode?: string | null
        }
        Relationships: []
      }
      "Dev.Leftover.Test.k": {
        Row: {
          "Check-Num": string | null
          ChkNo: string | null
          City: string | null
          Communications: string | null
          ContactInfoNotOnWeb: string | null
          CoordinatorCurriculum: string | null
          Curriculum: string | null
          "Date Received": string | null
          DOB: string | null
          Donation: string | null
          email: string
          Email: string | null
          Finance: string | null
          FirstName: string | null
          Forum: string | null
          Gndr: string | null
          Joined: string | null
          LastName: string | null
          LOA: string | null
          Membership: string | null
          New: string | null
          Newsletter: string | null
          No: number | null
          OfficeMgr: string | null
          "OLLI #": string | null
          Orient: string | null
          Outreach: string | null
          Paid: string | null
          Phone: string | null
          Registrar: string | null
          Renewed: string | null
          State: string | null
          Street: string | null
          Supplies: string | null
          Technology: string | null
          USPS: string | null
          Web: string | null
          Website: string | null
          ZipCode: string | null
        }
        Insert: {
          "Check-Num"?: string | null
          ChkNo?: string | null
          City?: string | null
          Communications?: string | null
          ContactInfoNotOnWeb?: string | null
          CoordinatorCurriculum?: string | null
          Curriculum?: string | null
          "Date Received"?: string | null
          DOB?: string | null
          Donation?: string | null
          email: string
          Email?: string | null
          Finance?: string | null
          FirstName?: string | null
          Forum?: string | null
          Gndr?: string | null
          Joined?: string | null
          LastName?: string | null
          LOA?: string | null
          Membership?: string | null
          New?: string | null
          Newsletter?: string | null
          No?: number | null
          OfficeMgr?: string | null
          "OLLI #"?: string | null
          Orient?: string | null
          Outreach?: string | null
          Paid?: string | null
          Phone?: string | null
          Registrar?: string | null
          Renewed?: string | null
          State?: string | null
          Street?: string | null
          Supplies?: string | null
          Technology?: string | null
          USPS?: string | null
          Web?: string | null
          Website?: string | null
          ZipCode?: string | null
        }
        Update: {
          "Check-Num"?: string | null
          ChkNo?: string | null
          City?: string | null
          Communications?: string | null
          ContactInfoNotOnWeb?: string | null
          CoordinatorCurriculum?: string | null
          Curriculum?: string | null
          "Date Received"?: string | null
          DOB?: string | null
          Donation?: string | null
          email?: string
          Email?: string | null
          Finance?: string | null
          FirstName?: string | null
          Forum?: string | null
          Gndr?: string | null
          Joined?: string | null
          LastName?: string | null
          LOA?: string | null
          Membership?: string | null
          New?: string | null
          Newsletter?: string | null
          No?: number | null
          OfficeMgr?: string | null
          "OLLI #"?: string | null
          Orient?: string | null
          Outreach?: string | null
          Paid?: string | null
          Phone?: string | null
          Registrar?: string | null
          Renewed?: string | null
          State?: string | null
          Street?: string | null
          Supplies?: string | null
          Technology?: string | null
          USPS?: string | null
          Web?: string | null
          Website?: string | null
          ZipCode?: string | null
        }
        Relationships: []
      }
      "Enrollment-24a": {
        Row: {
          CreatedAt: string | null
          EMail: string | null
          FirstName: string | null
          FriAM: string | null
          Friend: string | null
          FriPM: string | null
          id: number
          LastName: string
          MonAM: string | null
          MonPM: string | null
          NumberSDGs: number | null
          Phone: string | null
          RequestComment: string | null
          SDG1: string | null
          SDG2: string | null
          SDG3: string | null
          SDG4: string | null
          SDG5: string | null
          SDG6: string | null
          ThuAM: string | null
          ThuPM: string | null
          TueAM: string | null
          TuePM: string | null
          WedAM: string | null
          WedPM: string | null
          WHERE: string | null
          WillCoordinate: string | null
        }
        Insert: {
          CreatedAt?: string | null
          EMail?: string | null
          FirstName?: string | null
          FriAM?: string | null
          Friend?: string | null
          FriPM?: string | null
          id?: number
          LastName: string
          MonAM?: string | null
          MonPM?: string | null
          NumberSDGs?: number | null
          Phone?: string | null
          RequestComment?: string | null
          SDG1?: string | null
          SDG2?: string | null
          SDG3?: string | null
          SDG4?: string | null
          SDG5?: string | null
          SDG6?: string | null
          ThuAM?: string | null
          ThuPM?: string | null
          TueAM?: string | null
          TuePM?: string | null
          WedAM?: string | null
          WedPM?: string | null
          WHERE?: string | null
          WillCoordinate?: string | null
        }
        Update: {
          CreatedAt?: string | null
          EMail?: string | null
          FirstName?: string | null
          FriAM?: string | null
          Friend?: string | null
          FriPM?: string | null
          id?: number
          LastName?: string
          MonAM?: string | null
          MonPM?: string | null
          NumberSDGs?: number | null
          Phone?: string | null
          RequestComment?: string | null
          SDG1?: string | null
          SDG2?: string | null
          SDG3?: string | null
          SDG4?: string | null
          SDG5?: string | null
          SDG6?: string | null
          ThuAM?: string | null
          ThuPM?: string | null
          TueAM?: string | null
          TuePM?: string | null
          WedAM?: string | null
          WedPM?: string | null
          WHERE?: string | null
          WillCoordinate?: string | null
        }
        Relationships: []
      }
      "Enrollment-24b": {
        Row: {
          CreatedAt: string | null
          EMail: string | null
          FirstName: string | null
          FriAM: string | null
          Friend: string | null
          FriPM: string | null
          id: number
          LastName: string
          MonAM: string | null
          MonPM: string | null
          NumberSDGs: number | null
          Phone: string | null
          RequestComment: string | null
          SDG1: string | null
          SDG2: string | null
          SDG3: string | null
          SDG4: string | null
          SDG5: string | null
          SDG6: string | null
          ThuAM: string | null
          ThuPM: string | null
          TueAM: string | null
          TuePM: string | null
          WedAM: string | null
          WedPM: string | null
          WHERE: string | null
          WillCoordinate: string | null
        }
        Insert: {
          CreatedAt?: string | null
          EMail?: string | null
          FirstName?: string | null
          FriAM?: string | null
          Friend?: string | null
          FriPM?: string | null
          id?: number
          LastName: string
          MonAM?: string | null
          MonPM?: string | null
          NumberSDGs?: number | null
          Phone?: string | null
          RequestComment?: string | null
          SDG1?: string | null
          SDG2?: string | null
          SDG3?: string | null
          SDG4?: string | null
          SDG5?: string | null
          SDG6?: string | null
          ThuAM?: string | null
          ThuPM?: string | null
          TueAM?: string | null
          TuePM?: string | null
          WedAM?: string | null
          WedPM?: string | null
          WHERE?: string | null
          WillCoordinate?: string | null
        }
        Update: {
          CreatedAt?: string | null
          EMail?: string | null
          FirstName?: string | null
          FriAM?: string | null
          Friend?: string | null
          FriPM?: string | null
          id?: number
          LastName?: string
          MonAM?: string | null
          MonPM?: string | null
          NumberSDGs?: number | null
          Phone?: string | null
          RequestComment?: string | null
          SDG1?: string | null
          SDG2?: string | null
          SDG3?: string | null
          SDG4?: string | null
          SDG5?: string | null
          SDG6?: string | null
          ThuAM?: string | null
          ThuPM?: string | null
          TueAM?: string | null
          TuePM?: string | null
          WedAM?: string | null
          WedPM?: string | null
          WHERE?: string | null
          WillCoordinate?: string | null
        }
        Relationships: []
      }
      "Enrollment-24c": {
        Row: {
          CreatedAt: string | null
          EMail: string | null
          FirstName: string | null
          FriAM: string | null
          Friend: string | null
          FriPM: string | null
          id: number
          LastName: string
          MonAM: string | null
          MonPM: string | null
          NumberSDGs: number | null
          Phone: string | null
          RequestComment: string | null
          SDG1: string | null
          SDG2: string | null
          SDG3: string | null
          SDG4: string | null
          SDG5: string | null
          SDG6: string | null
          ThuAM: string | null
          ThuPM: string | null
          TueAM: string | null
          TuePM: string | null
          WedAM: string | null
          WedPM: string | null
          WHERE: string | null
          WillCoordinate: string | null
        }
        Insert: {
          CreatedAt?: string | null
          EMail?: string | null
          FirstName?: string | null
          FriAM?: string | null
          Friend?: string | null
          FriPM?: string | null
          id?: number
          LastName: string
          MonAM?: string | null
          MonPM?: string | null
          NumberSDGs?: number | null
          Phone?: string | null
          RequestComment?: string | null
          SDG1?: string | null
          SDG2?: string | null
          SDG3?: string | null
          SDG4?: string | null
          SDG5?: string | null
          SDG6?: string | null
          ThuAM?: string | null
          ThuPM?: string | null
          TueAM?: string | null
          TuePM?: string | null
          WedAM?: string | null
          WedPM?: string | null
          WHERE?: string | null
          WillCoordinate?: string | null
        }
        Update: {
          CreatedAt?: string | null
          EMail?: string | null
          FirstName?: string | null
          FriAM?: string | null
          Friend?: string | null
          FriPM?: string | null
          id?: number
          LastName?: string
          MonAM?: string | null
          MonPM?: string | null
          NumberSDGs?: number | null
          Phone?: string | null
          RequestComment?: string | null
          SDG1?: string | null
          SDG2?: string | null
          SDG3?: string | null
          SDG4?: string | null
          SDG5?: string | null
          SDG6?: string | null
          ThuAM?: string | null
          ThuPM?: string | null
          TueAM?: string | null
          TuePM?: string | null
          WedAM?: string | null
          WedPM?: string | null
          WHERE?: string | null
          WillCoordinate?: string | null
        }
        Relationships: []
      }
      "Enrollment-25-a": {
        Row: {
          CreatedAt: string | null
          EMail: string | null
          FirstName: string | null
          FriAM: string | null
          Friend: string | null
          FriPM: string | null
          id: number
          LastName: string
          MonAM: string | null
          MonPM: string | null
          NumberSDGs: number | null
          Phone: string | null
          RequestComment: string | null
          SDG1: string | null
          SDG2: string | null
          SDG3: string | null
          SDG4: string | null
          SDG5: string | null
          SDG6: string | null
          ThuAM: string | null
          ThuPM: string | null
          TueAM: string | null
          TuePM: string | null
          WedAM: string | null
          WedPM: string | null
          WHERE: string | null
          WillCoordinate: string | null
        }
        Insert: {
          CreatedAt?: string | null
          EMail?: string | null
          FirstName?: string | null
          FriAM?: string | null
          Friend?: string | null
          FriPM?: string | null
          id?: number
          LastName: string
          MonAM?: string | null
          MonPM?: string | null
          NumberSDGs?: number | null
          Phone?: string | null
          RequestComment?: string | null
          SDG1?: string | null
          SDG2?: string | null
          SDG3?: string | null
          SDG4?: string | null
          SDG5?: string | null
          SDG6?: string | null
          ThuAM?: string | null
          ThuPM?: string | null
          TueAM?: string | null
          TuePM?: string | null
          WedAM?: string | null
          WedPM?: string | null
          WHERE?: string | null
          WillCoordinate?: string | null
        }
        Update: {
          CreatedAt?: string | null
          EMail?: string | null
          FirstName?: string | null
          FriAM?: string | null
          Friend?: string | null
          FriPM?: string | null
          id?: number
          LastName?: string
          MonAM?: string | null
          MonPM?: string | null
          NumberSDGs?: number | null
          Phone?: string | null
          RequestComment?: string | null
          SDG1?: string | null
          SDG2?: string | null
          SDG3?: string | null
          SDG4?: string | null
          SDG5?: string | null
          SDG6?: string | null
          ThuAM?: string | null
          ThuPM?: string | null
          TueAM?: string | null
          TuePM?: string | null
          WedAM?: string | null
          WedPM?: string | null
          WHERE?: string | null
          WillCoordinate?: string | null
        }
        Relationships: []
      }
      "Enrollment-TEMPLATE": {
        Row: {
          CreatedAt: string | null
          EMail: string | null
          FirstName: string | null
          FriAM: number | null
          Friend: string | null
          FriPM: number | null
          id: number
          LastName: string | null
          MonAM: number | null
          MonPM: number | null
          NumberSDGs: number | null
          Phone: string | null
          RequestComment: string | null
          SDG1: string | null
          SDG2: string | null
          SDG3: string | null
          SDG4: string | null
          SDG5: string | null
          SDG6: string | null
          ThuAM: number | null
          ThuPM: number | null
          TueAM: number | null
          TuePM: number | null
          WedAM: number | null
          WedPM: string | null
          WillCoordinate: string | null
        }
        Insert: {
          CreatedAt?: string | null
          EMail?: string | null
          FirstName?: string | null
          FriAM?: number | null
          Friend?: string | null
          FriPM?: number | null
          id?: number
          LastName?: string | null
          MonAM?: number | null
          MonPM?: number | null
          NumberSDGs?: number | null
          Phone?: string | null
          RequestComment?: string | null
          SDG1?: string | null
          SDG2?: string | null
          SDG3?: string | null
          SDG4?: string | null
          SDG5?: string | null
          SDG6?: string | null
          ThuAM?: number | null
          ThuPM?: number | null
          TueAM?: number | null
          TuePM?: number | null
          WedAM?: number | null
          WedPM?: string | null
          WillCoordinate?: string | null
        }
        Update: {
          CreatedAt?: string | null
          EMail?: string | null
          FirstName?: string | null
          FriAM?: number | null
          Friend?: string | null
          FriPM?: number | null
          id?: number
          LastName?: string | null
          MonAM?: number | null
          MonPM?: number | null
          NumberSDGs?: number | null
          Phone?: string | null
          RequestComment?: string | null
          SDG1?: string | null
          SDG2?: string | null
          SDG3?: string | null
          SDG4?: string | null
          SDG5?: string | null
          SDG6?: string | null
          ThuAM?: number | null
          ThuPM?: number | null
          TueAM?: number | null
          TuePM?: number | null
          WedAM?: number | null
          WedPM?: string | null
          WillCoordinate?: string | null
        }
        Relationships: []
      }
      forum_registrations: {
        Row: {
          forum_id: number | null
          member_id: number | null
          pid: number
        }
        Insert: {
          forum_id?: number | null
          member_id?: number | null
          pid?: number
        }
        Update: {
          forum_id?: number | null
          member_id?: number | null
          pid?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_registrations_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "forums"
            referencedColumns: ["pid"]
          },
          {
            foreignKeyName: "forum_registrations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["pid"]
          },
        ]
      }
      forums: {
        Row: {
          available_spots: number | null
          date: string | null
          description: string | null
          forum_name: string | null
          pid: number
          product_id: number | null
        }
        Insert: {
          available_spots?: number | null
          date?: string | null
          description?: string | null
          forum_name?: string | null
          pid?: number
          product_id?: number | null
        }
        Update: {
          available_spots?: number | null
          date?: string | null
          description?: string | null
          forum_name?: string | null
          pid?: number
          product_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forums_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["pid"]
          },
        ]
      }
      mail_orders: {
        Row: {
          member_id: number | null
          order_date: string
          order_id: number
          order_status: string | null
          shipping_address: string
        }
        Insert: {
          member_id?: number | null
          order_date: string
          order_id?: number
          order_status?: string | null
          shipping_address: string
        }
        Update: {
          member_id?: number | null
          order_date?: string
          order_id?: number
          order_status?: string | null
          shipping_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_orders_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["pid"]
          },
        ]
      }
      member_names: {
        Row: {
          member_id: number | null
          name: string | null
          pid: number
        }
        Insert: {
          member_id?: number | null
          name?: string | null
          pid: number
        }
        Update: {
          member_id?: number | null
          name?: string | null
          pid?: number
        }
        Relationships: [
          {
            foreignKeyName: "member_names_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["pid"]
          },
        ]
      }
      members: {
        Row: {
          city: string | null
          date_joined: string | null
          date_of_birth: string | null
          deceased_date: string | null
          email: string | null
          emergency_contact: string | null
          emergency_contact_phone: string | null
          expiration_date: string | null
          first_name: string | null
          gender: string | null
          last_name: string | null
          member_status: string | null
          notes: string | null
          orientation_date: string | null
          partner: string | null
          phone: string | null
          photo_link: string | null
          pid: number
          public: boolean | null
          state: string | null
          street_address: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          date_joined?: string | null
          date_of_birth?: string | null
          deceased_date?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          expiration_date?: string | null
          first_name?: string | null
          gender?: string | null
          last_name?: string | null
          member_status?: string | null
          notes?: string | null
          orientation_date?: string | null
          partner?: string | null
          phone?: string | null
          photo_link?: string | null
          pid?: number
          public?: boolean | null
          state?: string | null
          street_address?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          date_joined?: string | null
          date_of_birth?: string | null
          deceased_date?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          expiration_date?: string | null
          first_name?: string | null
          gender?: string | null
          last_name?: string | null
          member_status?: string | null
          notes?: string | null
          orientation_date?: string | null
          partner?: string | null
          phone?: string | null
          photo_link?: string | null
          pid?: number
          public?: boolean | null
          state?: string | null
          street_address?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      officer_positions: {
        Row: {
          name_of_office: string
          pid: number
        }
        Insert: {
          name_of_office: string
          pid?: number
        }
        Update: {
          name_of_office?: string
          pid?: number
        }
        Relationships: []
      }
      officers: {
        Row: {
          end_date: string | null
          member_id: number | null
          officer_positions_id: number | null
          pid: number
          start_date: string | null
        }
        Insert: {
          end_date?: string | null
          member_id?: number | null
          officer_positions_id?: number | null
          pid?: number
          start_date?: string | null
        }
        Update: {
          end_date?: string | null
          member_id?: number | null
          officer_positions_id?: number | null
          pid?: number
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "officers_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["pid"]
          },
          {
            foreignKeyName: "officers_officer_positions_id_fkey"
            columns: ["officer_positions_id"]
            isOneToOne: false
            referencedRelation: "officer_positions"
            referencedColumns: ["pid"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          external_transaction_id: string
          fee: number | null
          payment_platform: Database["public"]["Enums"]["paymentplatform"]
          skus: string[]
          sqsp_order_id: string | null
          sqsp_transaction_id: string
          updated_at: string | null
          user_amounts: number[] | null
          user_emails: string[]
          user_names: string[] | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          external_transaction_id: string
          fee?: number | null
          payment_platform: Database["public"]["Enums"]["paymentplatform"]
          skus: string[]
          sqsp_order_id?: string | null
          sqsp_transaction_id: string
          updated_at?: string | null
          user_amounts?: number[] | null
          user_emails: string[]
          user_names?: string[] | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          external_transaction_id?: string
          fee?: number | null
          payment_platform?: Database["public"]["Enums"]["paymentplatform"]
          skus?: string[]
          sqsp_order_id?: string | null
          sqsp_transaction_id?: string
          updated_at?: string | null
          user_amounts?: number[] | null
          user_emails?: string[]
          user_names?: string[] | null
        }
        Relationships: []
      }
      orders_backup: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          external_transaction_id: string
          fee: number | null
          payment_platform: Database["public"]["Enums"]["paymentplatform"]
          skus: string[]
          sqsp_order_id: string | null
          sqsp_transaction_id: string
          updated_at: string | null
          user_amounts: number[] | null
          user_emails: string[]
          user_names: string[] | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          external_transaction_id: string
          fee?: number | null
          payment_platform: Database["public"]["Enums"]["paymentplatform"]
          skus: string[]
          sqsp_order_id?: string | null
          sqsp_transaction_id: string
          updated_at?: string | null
          user_amounts?: number[] | null
          user_emails: string[]
          user_names?: string[] | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          external_transaction_id?: string
          fee?: number | null
          payment_platform?: Database["public"]["Enums"]["paymentplatform"]
          skus?: string[]
          sqsp_order_id?: string | null
          sqsp_transaction_id?: string
          updated_at?: string | null
          user_amounts?: number[] | null
          user_emails?: string[]
          user_names?: string[] | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          permission: string
        }
        Insert: {
          permission: string
        }
        Update: {
          permission?: string
        }
        Relationships: []
      }
      product_analytics: {
        Row: {
          created_at: string | null
          description: string
          month: string
          month_fees: number | null
          month_profit: number | null
          month_sales: number | null
          sku: string
          updated_at: string | null
          year: string
          ytd_fees: number | null
          ytd_profit: number | null
          ytd_sales: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          month: string
          month_fees?: number | null
          month_profit?: number | null
          month_sales?: number | null
          sku: string
          updated_at?: string | null
          year: string
          ytd_fees?: number | null
          ytd_profit?: number | null
          ytd_sales?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          month?: string
          month_fees?: number | null
          month_profit?: number | null
          month_sales?: number | null
          sku?: string
          updated_at?: string | null
          year?: string
          ytd_fees?: number | null
          ytd_profit?: number | null
          ytd_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_analytics_sku_products"
            columns: ["sku"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["sku"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string
          pid: number
          sku: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          pid?: number
          sku: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          pid?: number
          sku?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      "Prototype-MembershipDB": {
        Row: {
          CheckNum: number | null
          ChkNo: string | null
          City: string | null
          ContactInfoNotOnWeb: string | null
          DateReceived: string | null
          DOB: string | null
          Donation: string | null
          email: string | null
          "Email-commun": string | null
          FirstName: string | null
          Gndr: string | null
          ID: number
          Joined: string | null
          LastName: string
          New: string | null
          Num: number | null
          Orient: string | null
          Paid: string | null
          Phone: string | null
          Renewed: string | null
          State: string | null
          Street: string | null
          "USPS-commun": string | null
          Web: string | null
          ZipCode: string | null
        }
        Insert: {
          CheckNum?: number | null
          ChkNo?: string | null
          City?: string | null
          ContactInfoNotOnWeb?: string | null
          DateReceived?: string | null
          DOB?: string | null
          Donation?: string | null
          email?: string | null
          "Email-commun"?: string | null
          FirstName?: string | null
          Gndr?: string | null
          ID: number
          Joined?: string | null
          LastName: string
          New?: string | null
          Num?: number | null
          Orient?: string | null
          Paid?: string | null
          Phone?: string | null
          Renewed?: string | null
          State?: string | null
          Street?: string | null
          "USPS-commun"?: string | null
          Web?: string | null
          ZipCode?: string | null
        }
        Update: {
          CheckNum?: number | null
          ChkNo?: string | null
          City?: string | null
          ContactInfoNotOnWeb?: string | null
          DateReceived?: string | null
          DOB?: string | null
          Donation?: string | null
          email?: string | null
          "Email-commun"?: string | null
          FirstName?: string | null
          Gndr?: string | null
          ID?: number
          Joined?: string | null
          LastName?: string
          New?: string | null
          Num?: number | null
          Orient?: string | null
          Paid?: string | null
          Phone?: string | null
          Renewed?: string | null
          State?: string | null
          Street?: string | null
          "USPS-commun"?: string | null
          Web?: string | null
          ZipCode?: string | null
        }
        Relationships: []
      }
      "Prototype-MembershipDB-Volunteerism": {
        Row: {
          "Check #": number | null
          ChkNo: string | null
          City: string | null
          Communications: string | null
          ContactInfoNotOnWeb: string | null
          CoordinatorCurriculum: string | null
          Curriculum: string | null
          "Date Received": string | null
          DOB: string | null
          Donation: string | null
          email: string | null
          Email: string | null
          Finance: string | null
          FirstName: string | null
          Forum: string | null
          Gndr: string | null
          ID: string
          Joined: string | null
          LastName: string | null
          Membership: string | null
          New: string | null
          Newsletter: string | null
          "No.": number | null
          OfficeMgr: string | null
          "Orient.": string | null
          Outreach: string | null
          Paid: string | null
          Phone: string | null
          Registrar: string | null
          Renewed: string | null
          State: string | null
          Street: string | null
          Supplies: string | null
          Technology: string | null
          USPS: string | null
          "Web?": string | null
          Website: string | null
          ZipCode: string | null
        }
        Insert: {
          "Check #"?: number | null
          ChkNo?: string | null
          City?: string | null
          Communications?: string | null
          ContactInfoNotOnWeb?: string | null
          CoordinatorCurriculum?: string | null
          Curriculum?: string | null
          "Date Received"?: string | null
          DOB?: string | null
          Donation?: string | null
          email?: string | null
          Email?: string | null
          Finance?: string | null
          FirstName?: string | null
          Forum?: string | null
          Gndr?: string | null
          ID: string
          Joined?: string | null
          LastName?: string | null
          Membership?: string | null
          New?: string | null
          Newsletter?: string | null
          "No."?: number | null
          OfficeMgr?: string | null
          "Orient."?: string | null
          Outreach?: string | null
          Paid?: string | null
          Phone?: string | null
          Registrar?: string | null
          Renewed?: string | null
          State?: string | null
          Street?: string | null
          Supplies?: string | null
          Technology?: string | null
          USPS?: string | null
          "Web?"?: string | null
          Website?: string | null
          ZipCode?: string | null
        }
        Update: {
          "Check #"?: number | null
          ChkNo?: string | null
          City?: string | null
          Communications?: string | null
          ContactInfoNotOnWeb?: string | null
          CoordinatorCurriculum?: string | null
          Curriculum?: string | null
          "Date Received"?: string | null
          DOB?: string | null
          Donation?: string | null
          email?: string | null
          Email?: string | null
          Finance?: string | null
          FirstName?: string | null
          Forum?: string | null
          Gndr?: string | null
          ID?: string
          Joined?: string | null
          LastName?: string | null
          Membership?: string | null
          New?: string | null
          Newsletter?: string | null
          "No."?: number | null
          OfficeMgr?: string | null
          "Orient."?: string | null
          Outreach?: string | null
          Paid?: string | null
          Phone?: string | null
          Registrar?: string | null
          Renewed?: string | null
          State?: string | null
          Street?: string | null
          Supplies?: string | null
          Technology?: string | null
          USPS?: string | null
          "Web?"?: string | null
          Website?: string | null
          ZipCode?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          date: string | null
          id: number
          notes: string | null
          prospect_member_id: number | null
          referred_by_member_id: number | null
        }
        Insert: {
          date?: string | null
          id?: number
          notes?: string | null
          prospect_member_id?: number | null
          referred_by_member_id?: number | null
        }
        Update: {
          date?: string | null
          id?: number
          notes?: string | null
          prospect_member_id?: number | null
          referred_by_member_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_prospect_member_id_fkey"
            columns: ["prospect_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["pid"]
          },
          {
            foreignKeyName: "referrals_referred_by_member_id_fkey"
            columns: ["referred_by_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["pid"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission: string
          role: string
        }
        Insert: {
          permission: string
          role: string
        }
        Update: {
          permission?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_fkey"
            columns: ["permission"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["permission"]
          },
          {
            foreignKeyName: "role_permissions_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role"]
          },
        ]
      }
      roles: {
        Row: {
          role: string
        }
        Insert: {
          role: string
        }
        Update: {
          role?: string
        }
        Relationships: []
      }
      sdg_members: {
        Row: {
          member_id: number | null
          pid: number
          sdg_id: number | null
        }
        Insert: {
          member_id?: number | null
          pid?: number
          sdg_id?: number | null
        }
        Update: {
          member_id?: number | null
          pid?: number
          sdg_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sdg_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["pid"]
          },
          {
            foreignKeyName: "sdg_members_sdg_id_fkey"
            columns: ["sdg_id"]
            isOneToOne: false
            referencedRelation: "sdgs"
            referencedColumns: ["pid"]
          },
        ]
      }
      sdgs: {
        Row: {
          coordinator: boolean | null
          description: string | null
          pid: number
          sdg: string
          trimester: string
        }
        Insert: {
          coordinator?: boolean | null
          description?: string | null
          pid?: number
          sdg: string
          trimester: string
        }
        Update: {
          coordinator?: boolean | null
          description?: string | null
          pid?: number
          sdg?: string
          trimester?: string
        }
        Relationships: []
      }
      tracking: {
        Row: {
          created_at: string | null
          cursor: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cursor: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cursor?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: number
          role: string
          user_id: string
        }
        Insert: {
          id?: number
          role: string
          user_id: string
        }
        Update: {
          id?: number
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          created_at: string | null
          date_expired: string | null
          date_renewed: string | null
          email: string
          emergency_contact: string | null
          emergency_contact_phone: string | null
          first_joined: string | null
          is_member: boolean | null
          name: string
          phone: string | null
          pk: string
          profile_pic: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_expired?: string | null
          date_renewed?: string | null
          email: string
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          first_joined?: string | null
          is_member?: boolean | null
          name: string
          phone?: string | null
          pk: string
          profile_pic?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_expired?: string | null
          date_renewed?: string | null
          email?: string
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          first_joined?: string | null
          is_member?: boolean | null
          name?: string
          phone?: string | null
          pk?: string
          profile_pic?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_member: {
        Args: {
          p_pid: number
        }
        Returns: undefined
      }
      get_current_user_permissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          permission: string
        }[]
      }
      get_current_user_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          role: string
        }[]
      }
      get_members_basic: {
        Args: Record<PropertyKey, never>
        Returns: {
          pid: number
          first_name: string
          last_name: string
          street_address: string
          city: string
          state: string
          zip: string
          phone: string
          email: string
        }[]
      }
      get_members_full: {
        Args: Record<PropertyKey, never>
        Returns: {
          pid: number
          first_name: string
          last_name: string
          street_address: string
          city: string
          state: string
          zip: string
          phone: string
          email: string
          emergency_contact: string
          emergency_contact_phone: string
          member_status: string
          expiration_date: string
          date_of_birth: string
          deceased_date: string
          public: boolean
          orientation_date: string
          date_joined: string
          notes: string
        }[]
      }
      get_users_basic: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          email: string
          id: string
        }[]
      }
      get_users_full: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string | null
          created_at: string | null
          date_expired: string | null
          date_renewed: string | null
          email: string
          emergency_contact: string | null
          emergency_contact_phone: string | null
          first_joined: string | null
          is_member: boolean | null
          name: string
          phone: string | null
          pk: string
          profile_pic: string | null
          updated_at: string | null
        }[]
      }
      has_permission: {
        Args: {
          p_permission: string
        }
        Returns: boolean
      }
      update_user: {
        Args: {
          p_user_id: string
          p_name: string
        }
        Returns: undefined
      }
      upsert_member: {
        Args: {
          p_pid: number
          p_first_name: string
          p_last_name: string
          p_street_address: string
          p_city: string
          p_state: string
          p_zip: string
          p_phone: string
          p_email: string
          p_emergency_contact: string
          p_emergency_contact_phone: string
          p_member_status: string
          p_expiration_date: string
          p_date_of_birth: string
          p_deceased_date: string
          p_public: boolean
          p_orientation_date: string
          p_date_joined: string
          p_notes: string
        }
        Returns: undefined
      }
    }
    Enums: {
      paymentplatform: "STRIPE" | "PAYPAL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
