import * as Yup from "yup";

export const productFormSchema = Yup.object()
  .shape({
    image: Yup.mixed().required("Please select an image"),
    name: Yup.string()
      .min(3, "at least 3 characters")
      .max(50, "at most 50 characters")
      .required("required"),
    price: Yup.number().required("required"),
    category: Yup.string().required("Category is required"),
    stock_quantity: Yup.string()
      .min(1, "at least 1 ")
      .max(4, "at most 9999 ")
      .required("required"),
    description: Yup.string()
      .min(3, "at least 3 characters")
      .max(900, "at most 900 characters")
      .required("required"),
    discounted_price: Yup.number()
      .nullable()
      .transform((v, o) => (o === "" ? null : v))
      .min(0, "must not be negative")
      .typeError("Enter a valid number"),
    discount_percentage: Yup.number()
      .nullable()
      .transform((v, o) => (o === "" ? null : v))
      .min(0, "must not be less than 0")
      .max(100, "must not be greater than 100")
      .typeError("Enter a valid number"),
    discount_period: Yup.string()
      .nullable()
      .transform((v, o) => (o === "" ? null : v)),

    amazing_offer: Yup.string()
      .nullable()
      .transform((v, o) => (o === "" ? null : v)),
    amazing_offer_period: Yup.string()
      .nullable()
      .transform((v, o) => (o === "" ? null : v)),
  })

  .test("discount-rules", null, function (values) {
    const { price, discounted_price, discount_percentage, discount_period } =
      values || {};
    const hasPrice = discounted_price != null && discounted_price !== "";
    const hasPercent =
      discount_percentage != null && discount_percentage !== "";
    const hasPeriod = !!discount_period;

    const errors = [];

    if (hasPrice && hasPercent) {
      errors.push(
        this.createError({
          path: "discount_percentage",
          message:
            "Please enter only one of discount price or discount percentage",
        })
      );
    }

    if ((hasPrice || hasPercent) && !hasPeriod) {
      errors.push(
        this.createError({
          path: "discount_period",
          message: "When entering a discount, a discount period is required",
        })
      );
    }

    if (hasPeriod && !hasPrice && !hasPercent) {
      const msg =
        "When entering a discount period, also fill in the discount price or discount percentage";
      errors.push(this.createError({ path: "discounted_price", message: msg }));
      errors.push(
        this.createError({ path: "discount_percentage", message: msg })
      );
    }

    if (hasPrice && price && discounted_price > price) {
      errors.push(
        this.createError({
          path: "discounted_price",
          message: "Discounted price cannot be greater than the original price",
        })
      );
    }

    if (hasPeriod) {
      const today = new Date();
      const periodDate = new Date(discount_period);
      if (periodDate < today) {
        errors.push(
          this.createError({
            path: "discount_period",
            message: "Discount period cannot be before today",
          })
        );
      }
    }

    return errors.length ? new Yup.ValidationError(errors) : true;
  })

  .test("amazing-offer-rules", null, function (values) {
    const { amazing_offer, amazing_offer_period } = values || {};
    const hasOffer = !!amazing_offer;
    const hasOfferPeriod = !!amazing_offer_period;

    const errors = [];

    if (hasOffer && !hasOfferPeriod) {
      errors.push(
        this.createError({
          path: "amazing_offer_period",
          message: "When entering an offer title, offer period is required",
        })
      );
    }

    if (hasOfferPeriod && !hasOffer) {
      errors.push(
        this.createError({
          path: "amazing_offer",
          message: "When entering an offer period, offer title is required",
        })
      );
    }

    if (hasOfferPeriod) {
      const today = new Date();
      const offerDate = new Date(amazing_offer_period);
      if (offerDate < today) {
        errors.push(
          this.createError({
            path: "amazing_offer_period",
            message: "Offer period cannot be before today",
          })
        );
      }
    }

    return errors.length ? new Yup.ValidationError(errors) : true;
  });
