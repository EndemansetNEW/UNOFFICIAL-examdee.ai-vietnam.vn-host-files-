import type { ChatKitReq, ThreadItem } from "./backend.types"
import type { PublicError } from "./error.types"
import type { ChatKitProfile, OuterCommands, PublicEvents } from "./frontend.types"
import type { WidgetComponent, WidgetRoot } from "./widgets"

// This is a type-only namespace and will disappear after compile.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Capability {
  export type Command = keyof OuterCommands
  export type Event = keyof PublicEvents
  export type Error = PublicError

  export type BackendOperation = ChatKitReq["type"]
  export type ThreadItemType = ThreadItem["type"]
  export type WidgetType = WidgetRoot["type"] | WidgetComponent["type"]

  export type Key =
    | `command.${Command}`
    | `event.${Event}`
    | `thread.item.${ThreadItemType}`
    | `backend.${BackendOperation}`
    | `error.${Error}`
    | `widget.${WidgetType}`

  export type Rules = {
    allow?: readonly Key[] // allow-list
    deny?: readonly Key[] // optional additional denies
  }
}

// Publicly exported capabili
export type Capabilities = {
  commands: Set<Capability.Command>
  events: Set<Capability.Event>
  errors: Set<Capability.Error>
  backend: Set<Capability.BackendOperation>
  threadItems: Set<Capability.ThreadItemType>
  widgets: Set<Capability.WidgetType>
}

// Default capabilities. We intersect this with allow/deny lists on profiles
// to compute effective capabilities.
export const BASE_CAPABILITY_ALLOWLIST = [
  // commands
  "command.setOptions",
  "command.sendUserMessage",
  "command.setComposerValue",
  "command.setThreadId",
  "command.focusComposer",
  "command.fetchUpdates",
  "command.sendCustomAction",
  "command.showHistory",
  "command.hideHistory",
  // events
  "event.ready",
  "event.error",
  "event.log",
  "event.composer.submit",
  "event.composer.layout.change",
  "event.response.start",
  "event.response.end",
  "event.response.stop",
  "event.thread.change",
  "event.tool.change",
  "event.thread.load.start",
  "event.thread.load.end",
  "event.toast.show",
  "event.toast.hide",
  "event.deeplink",
  "event.effect",
  // errors
  "error.StreamError",
  "error.StreamEventParsingError",
  "error.WidgetItemError",
  "error.InitialThreadLoadError",
  "error.FileAttachmentError",
  "error.HistoryViewError",
  "error.FatalAppError",
  "error.IntegrationError",
  "error.EntitySearchError",
  "error.DomainVerificationRequestError",
  // backend
  "backend.threads.get_by_id",
  "backend.threads.list",
  "backend.threads.update",
  "backend.threads.delete",
  "backend.threads.create",
  "backend.threads.add_user_message",
  "backend.threads.add_client_tool_output",
  "backend.threads.retry_after_item",
  "backend.threads.custom_action",
  "backend.threads.sync_custom_action",
  "backend.attachments.create",
  "backend.attachments.get_preview",
  "backend.attachments.delete",
  "backend.items.list",
  "backend.items.feedback",
  "backend.input.transcribe",
  // thread item types
  "thread.item.generated_image",
  "thread.item.user_message",
  "thread.item.assistant_message",
  "thread.item.client_tool_call",
  "thread.item.widget",
  "thread.item.task",
  "thread.item.workflow",
  "thread.item.end_of_turn",
  "thread.item.image_generation",
  // widgets
  "widget.Basic",
  "widget.Card",
  "widget.ListView",
  "widget.ListViewItem",
  "widget.Badge",
  "widget.Box",
  "widget.Row",
  "widget.Col",
  "widget.Button",
  "widget.Caption",
  "widget.Chart",
  "widget.Checkbox",
  "widget.DatePicker",
  "widget.Divider",
  "widget.Form",
  "widget.Icon",
  "widget.Image",
  "widget.Input",
  "widget.Label",
  "widget.Markdown",
  "widget.RadioGroup",
  "widget.Select",
  "widget.Spacer",
  "widget.Text",
  "widget.Textarea",
  "widget.Title",
  "widget.Transition",
] as const satisfies readonly Capability.Key[]

export const BASE_CAPABILITY_DENYLIST = [
  // --- commands
  "command.shareThread",
  "command.setTrainingOptOut",
  // --- events
  "event.thread.restore",
  "event.message.share",
  "event.image.download",
  "event.history.open",
  "event.history.close",
  "event.log.chatgpt",
  // --- errors
  // These errors considered internal and are not exposed to the user by default.
  "error.HttpError",
  "error.NetworkError",
  "error.UnhandledError",
  "error.UnhandledPromiseRejectionError",
  "error.StreamEventHandlingError",
  "error.StreamStopError",
  "error.ThreadRenderingError",
  "error.IntlError",
  "error.AppError",
  // --- backend
  "backend.threads.stop",
  "backend.threads.share",
  "backend.threads.create_from_shared",
  "backend.threads.init",
  "backend.attachments.process",
  // widgets
  "widget.CardCarousel",
  "widget.Favicon",
  "widget.CardLinkItem",
] as const satisfies readonly Capability.Key[]

export const PROFILE_TO_RULES = {
  "chatkit": {
    allow: [...BASE_CAPABILITY_ALLOWLIST, "thread.item.image_generation"],
    deny: BASE_CAPABILITY_DENYLIST,
  },
  "chatgpt-shell": {
    allow: [
      ...BASE_CAPABILITY_ALLOWLIST,
      // commands
      "command.shareThread",
      // events
      "event.response.stop",
      "event.thread.restore",
      "event.message.share",
      "event.image.download",
      "event.history.open",
      "event.history.close",
      "event.log.chatgpt",
      // errors
      "error.HttpError",
      "error.NetworkError",
      "error.ThreadRenderingError",
      // backend
      "backend.threads.stop",
      "backend.threads.share",
      "backend.threads.create_from_shared",
      "backend.threads.init",
      "backend.attachments.process",
      // thread items
      "thread.item.image_generation",
      // widgets
      "widget.CardCarousel",
      "widget.Favicon",
      "widget.CardLinkItem",
    ],
    deny: [
      // Prevent ChatGPT user messages and internal errors from leaking through logs
      "event.log",
      // No client tool support
      "backend.threads.add_client_tool_output",
    ],
  },
  // For anon users, the following features (that are enabled for logged-in chatgpt shell users) are limited:
  // - thread share (viewing a shared thread is possible)
  // - thread history
  "chatgpt-shell-anonymous": {
    allow: [
      ...BASE_CAPABILITY_ALLOWLIST,
      // commands
      "command.setTrainingOptOut", // only available in anon mode
      // events
      "event.response.stop",
      "event.thread.restore",
      "event.history.open",
      "event.history.close",
      "event.message.share",
      "event.log.chatgpt",
      // errors
      "error.HttpError",
      "error.NetworkError",
      "error.ThreadRenderingError",
      // backend
      "backend.threads.stop",
      "backend.threads.create_from_shared",
      "backend.threads.init",
      "backend.attachments.process",
      // thread items
      "thread.item.image_generation",
      // widgets
      "widget.CardCarousel",
      "widget.Favicon",
      "widget.CardLinkItem",
    ],
    deny: [
      // History is disabled in anon mode
      "command.showHistory",
      "command.hideHistory",
      // Prevent ChatGPT user messages and internal errors from leaking through logs
      "event.log",
      // No client tool support
      "backend.threads.add_client_tool_output",
      // No thread history support
      "backend.threads.list",
    ],
  },
} satisfies Record<ChatKitProfile, Capability.Rules>

type AllowedCapability<T extends ChatKitProfile> = NonNullable<
  (typeof PROFILE_TO_RULES)[T]["allow"]
>[number]
type DeniedCapability<T extends ChatKitProfile> = NonNullable<
  (typeof PROFILE_TO_RULES)[T]["deny"]
>[number]
type CapabilitiesFor<T extends ChatKitProfile> = Exclude<AllowedCapability<T>, DeniedCapability<T>>

export type AllowedEvent<T extends ChatKitProfile> =
  Extract<CapabilitiesFor<T>, `event.${string}`> extends `event.${infer E}` ? E : never
