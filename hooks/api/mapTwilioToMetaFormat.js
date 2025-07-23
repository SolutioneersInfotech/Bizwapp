const mapTwilioToMetaFormat = (twilioTemplates) => {
  return {
    data: twilioTemplates?.templates.map((template) => {
      const types = template.types;
      const textBody = types["twilio/text"]?.body || types["whatsapp/authentication"]?.body || "";

      return {
        name: template.friendly_name,
        previous_category: "UTILITY",
        parameter_format: "POSITIONAL",
        components: [
          {
            type: "HEADER",
            format: "TEXT",
            text: template.friendly_name
          },
          {
            type: "BODY",
            text: textBody
          },
          {
            type: "FOOTER",
            text: "Sent via Twilio"
          },
          {
            type: "BUTTONS",
            buttons: [
              { type: "QUICK_REPLY", text: "Track Order" },
              { type: "QUICK_REPLY", text: "Contact Support" }
            ]
          }
        ],
        language: template.language || "en",
        status: "APPROVED",
        category: "UTILITY",
        id: template.sid
      };
    }),
    paging: {
      cursors: {
        before: "MAZDZD",
        after: "MjQZD"
      }
    }
  };
};

export default mapTwilioToMetaFormat;