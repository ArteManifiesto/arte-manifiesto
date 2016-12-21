<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Actionable emails e.g. reset password</title>
    <link href="style.css" media="all" rel="stylesheet" type="text/css"/>
</head>

<body itemscope itemtype="http://schema.org/EmailMessage">

<table class="body-wrap">
    <tr>
        <td></td>
        <td class="container" width="600">
            <div class="content">
                <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope
                       itemtype="http://schema.org/ConfirmAction">
                    <tr>
                        <td class="content-wrap">
                            <meta itemprop="name" content="Confirm Email"/>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="content-block">
                                        Hola <strong>{{ to.fullname }}</strong>.
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                        Este es un correo de confirmación de tu pedido y hemos validado que tu operación de pago ha sido exitosa.
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                        Los detalles de tu orden:
                                        <a href="{{baseUrl}}/user/{{product.User.username}}/product/{{product.nameSlugify}}">
                                          <img src="{{product.photo|addFilter('w_300,q_80,c_limit')}}">
                                        </a>
                                        {{product.name}}
                                        por {{product.User.fullname}}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                        De parte de todo el equipo de arte manifiesto queremos agradecerte por adquirir este producto. Recuerda que con tu compra estas apoyando el desarrollo de un artista.
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                        Si deseas conocer mas del artista has click aquí
                                        <a href="{{baseUrl}}/user/{{to.username}}/work/{{work.nameSlugify}}">
                                            {{product.User.fullname}}
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                        &mdash; Arte Manifiesto
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <div class="footer">
                    <table width="100%">
                        <tr>
                            <td class="aligncenter content-block">Siguenos <a
                                        href="https://twitter.com/artemanifiesto">@ArteManifiesto</a> en Twitter.
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </td>
        <td></td>
    </tr>
</table>

</body>
</html>
