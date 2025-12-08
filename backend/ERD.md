# Entity Relationship Diagram

```mermaid
erDiagram
    Tenant ||--o{ User : has
    Tenant ||--o{ ShopifyConnectorSettings : has
    Tenant ||--o{ GA4ConnectorSettings : has
    Tenant ||--o{ NotificationTemplate : has
    Tenant ||--o{ NotificationSubscription : has
    Tenant ||--o{ NotificationRule : has

    NotificationRule ||--|| NotificationTemplate : uses

    Tenant {
        UUID id PK
        string name
        string slug UK
        string status
        datetime created_at
    }

    User {
        UUID id PK
        UUID tenant_id FK
        string email UK
        string hashed_password
        string full_name
        string role
        boolean is_active
        boolean is_platform_admin
        datetime created_at
    }

    ShopifyConnectorSettings {
        UUID id PK
        UUID tenant_id FK
        string shop_domain
        string access_token
        string status
        datetime created_at
        datetime updated_at
    }

    GA4ConnectorSettings {
        UUID id PK
        UUID tenant_id FK
        string ga4_property_id
        string credentials_json
        string status
        datetime created_at
        datetime updated_at
    }

    NotificationTemplate {
        UUID id PK
        UUID tenant_id FK
        string name
        string channel
        text body_template
        boolean is_default
        datetime created_at
        datetime updated_at
    }

    NotificationSubscription {
        UUID id PK
        UUID tenant_id FK
        string customer_name
        string whatsapp_number
        string product_id
        string variant_id
        string product_name
        string source_channel
        string status
        string ga_utm_source
        string ga_utm_medium
        string ga_utm_campaign
        datetime created_at
        datetime notified_at
    }

    NotificationRule {
        UUID id PK
        UUID tenant_id FK
        string trigger_type
        UUID template_id FK
        boolean active
        string send_window_start
        string send_window_end
        string utm_source
        string utm_medium
        string utm_campaign
        datetime created_at
        datetime updated_at
    }
